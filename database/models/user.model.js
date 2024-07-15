import { Schema, model } from "mongoose";

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    recoveryEmail: { type: String, required: true },
    DOB: { type: Date, required: true },
    mobileNumber: { type: String, required: true, unique: true },
    role: {
        type: String,
        required: true,
        enum: ['User', 'Company_HR']
    },
    status: {
        type: String,
        required: true,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    otp: {
        code: String,
        createdDate: Date,
        expiaryDate: Date
    }
});

userSchema.virtual('username').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const User = model('User', userSchema);
