import { Schema, model } from "mongoose";
const applicationSchema = new Schema({
    jobId: { type: String, required: true },
    userId: { type: String, required: true },
    userTechSkills: { type: [String], required: true },
    userSoftSkills: { type: [String], required: true },
    userResume: {
        type: String,
        required: true,
        validate: {
            validator: value=> {
                return value.endsWith('.pdf');
            },
            message: 'userResume must be a PDF file'
        }
    }
});

export const Application = model('Application', applicationSchema);

