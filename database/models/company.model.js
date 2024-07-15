import { Schema, model } from "mongoose";

const companySchema = new Schema({
    companyName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: {
        type: String,
        required: true,
        enum: ['1-10', '11-20', '21-50', '51-100', '100+'] 
    },
    companyEmail: { type: String, required: true, unique: true },
    companyHR:{type: Schema.Types.ObjectId, ref: 'User'}

})

export const Company = model('Company',companySchema);