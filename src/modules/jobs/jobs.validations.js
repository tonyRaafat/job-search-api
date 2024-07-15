import Joi from "joi"

export const jobValidation = Joi.object({
    company:Joi.string().hex().required(),
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
    workingTime: Joi.string().valid('part-time', 'full-time').required(),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
});

export const updateJobValidation = Joi.object({
    id:Joi.string().hex().required(),
    jobTitle: Joi.string(),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
    workingTime: Joi.string().valid('part-time', 'full-time'),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobDescription: Joi.string(),
    technicalSkills: Joi.array().items(Joi.string()),
    softSkills: Joi.array().items(Joi.string()),
}).unknown(false).min(1);

export const companyJobs = Joi.object({
    companyName:Joi.string().required()
})

export const jobFilterValidation = Joi.object({
    workingTime: Joi.string().valid('part-time', 'full-time'),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobTitle: Joi.string(),
    technicalSkills: Joi.array().items(Joi.string())
});

export const applicationValidation = Joi.object({
    id: Joi.string().hex().required(),
    userTechSkills: Joi.array().items(Joi.string()).required(),
    userSoftSkills: Joi.array().items(Joi.string()).required(),
    userResume: Joi.any()
});