import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import sendEmail from '../../utils/email.js';
import { User } from '../../../database/models/user.model.js';
import { throwError } from '../../utils/throwerror.js';

export const register = async (req, res, next) => {
    try {
        let user = await User.findOne({$or:[{email: req.body.email},{mobileNumber:req.body.mobileNumber}]});
        if (user) {
            if(user.email == req.body.email) throw throwError('email already exist', 400)

            if(user.mobileNumber == req.body.mobileNumber) throw throwError('phone number already exist', 400)
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword
        user = new User(req.body);
        await sendVerificationEmail(user)
        await user.save()
        res.send({ id: user._id, username: user.username, email: user.email });
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {
        let user;
        if (req.body.email) {
            user = await User.findOne({ email:req.body.email });
            if (!user) throw throwError('Invalid email.', 400)
        } else if (req.body.mobileNumber) {
            user = await User.findOne({ mobileNumber:req.body.mobileNumber });
            if (!user) throw throwError('Invalid mobile number.', 400)
        }
        if (user?.otp == {}) throw throwError('User needs to be verified', 400)

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) throw throwError('Invalid password.', 400);
        user.status = 'online'
        await user.save()
        const token = jwt.sign({ _id: user._id,email:user.email }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        next(error)
    }
}

export const verifyOtp = async (req, res, next) => {
    try {
        const { userId, otpCode } = req.body;
        const user = await User.findById(userId)
        if (!user) throw throwError('user not found!!!!', 400)
        if (!user?.otp) throw throwError("user is already verified", 400)
        const { otp } = user;
        const { expiaryDate } = otp
        const hashedOtp = otp.code
        if (expiaryDate < Date.now()) {
            await sendVerificationEmail(user)
            throw throwError("OTP is expired anthor otp code is sent to you via email", 400)
        } else {
            const validOtp = bcrypt.compareSync(otpCode, hashedOtp)
            if (!validOtp) {
                throw throwError("wrong OTP!", 400)
            } else {
                await User.updateOne({ _id: userId }, { $unset: { otp: 1 } })
                return res.status(200).json({ msg: "user is now verfied" });
            }
        }
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req,res,next)=> {
    try {
        await User.updateOne({ _id: req.user._id },req.body)
        res.json({msg:"user updated"})
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req,res,next)=> {
    try {
        await User.deleteOne({ _id: req.user._id })
        
        res.json({msg:"user deleted"})
    } catch (error) {
        next(error)
    }
}

export const getUserData = async (req,res,next)=> {
    try {
        const user = await User.findById(req.user._id)
        if(!user) throw throwError('no data found',404)
        res.json({userData:user})
    } catch (error) {
        next(error)
    }
}

export const getOtherUsersData = async (req, res,next) => {
    try {
      const user = await User.findById(req.params.id).select('-password'); // Exclude password field
      if (!user) {
        throw throwError('User not found' ,404);
      }
      res.send(user);
    } catch (error) {
      next(error);
    }
  } 

//$2b$10$QCnziVhPE.YaWZqJIdeRy.7hMuJBO5FF5CgoRq2bChMeIYsGMpjUu
  export const updatePassword = async (req, res,next) => {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user || !(bcrypt.compareSync(oldPassword,user.password))) {
        throw throwError( 'Incorrect old password' ,400);
      }
      const salt = await bcrypt.genSalt(10);
      user.password = bcrypt.hashSync(newPassword,salt)
      await user.save();
      res.send({ message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email})
        if (!user) {
            throw throwError('User not found' ,404);
          }
        await sendVerificationEmail(user)
        res.json({ msg: "OTP code is send check your inbox" })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req,res,next)=>{
    try {
        const { email,password, otpCode } = req.body;
        const user = await User.findOne({email})
        if (!user) throw throwError('user not found!!!!', 400)
        if (!user?.otp) throw throwError("user is already verified", 400)
        const { otp } = user;
        const { expiaryDate } = otp
        const hashedOtp = otp.code
        if (expiaryDate < Date.now()) {
            await sendVerificationEmail(user)
            throw throwError("OTP is expired anthor otp code is sent to you via email", 400)
        } else {
            const validOtp = bcrypt.compareSync(otpCode, hashedOtp)
            if (!validOtp) {
                throw throwError("wrong OTP!", 400)
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword =  bcrypt.hashSync(password, salt);
                await User.updateOne({email}, { $unset: { otp: 1 },password:hashedPassword })
                return res.status(200).json({ msg: "password updated" });
            }
        }
    } catch (error) {
        next(error)
    }
}

async function sendVerificationEmail(user) {
    try {
        const otp = `${Math.floor(10000 + Math.random() * 90000)}`
        const otpSalt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, otpSalt);
        await sendEmail(user.email, 'otp verification', {
            text: `Your OTP is: ${otp}`, html: otpEmailHtml(otp)
        })
        user.otp = {
            code: hashedOtp,
            createdDate: Date.now(),
            expiaryDate: Date.now() + 60 * 5 * 1000
        };
        await user.save()
    } catch (error) {
        throw throwError(error)
    }
}

function otpEmailHtml(otp) {
    return `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Job Search App</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for my API. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Anton</p>
    <hr style="border:none;border-top:1px solid #eee" />
  </div>
</div>`
}