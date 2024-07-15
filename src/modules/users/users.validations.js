import Joi from 'joi';

export const registerValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  recoveryEmail: Joi.string().email().required(),
  DOB: Joi.date().iso().required().custom((value, helpers) => {
    const date = new Date(value);
    if (
      date > Date.now()
    ) {
      return helpers.message("you can't be born in the future!!");
    }
    return value;
  }, 'DOB validation'),
  mobileNumber: Joi.string().pattern(/^(\+2|002)?01[0125][0-9]{8}$/).required(),
  role: Joi.string().valid('User', 'Company_HR').required(),
});

export const otpValidation = Joi.object({
  userId: Joi.string().hex().required(),
  otpCode: Joi.string().length(5).required()
})

export const loginValidation = Joi.object({
  email: Joi.string().email(),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/),
  password: Joi.string().required(),
}).xor('email', 'mobileNumber')

export const updateUservalidation = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  recoveryEmail: Joi.string().email().optional(),
  DOB: Joi.date().iso().optional().custom((value, helpers) => {
    const date = new Date(value);
    if (
      date > Date.now()
    ) {
      return helpers.message("you can't be born in the future!!");
    }
    return value;
  }, 'DOB validation'),
  mobileNumber: Joi.string().pattern(/^01[0125][0-9]{8}$/).optional(),
  role: Joi.string().valid('User', 'Company_HR').optional(),
}).unknown(false).min(1);

export const updatePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
});

export const forgotPasswordValidation = Joi.object({
  email:Joi.string().email().required()
})

export const resetPasswordValidation = Joi.object({
  email:Joi.string().email().required(),
  otpCode: Joi.string().length(5).required(),
  password: Joi.string().required(),
})