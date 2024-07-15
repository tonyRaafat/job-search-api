import Joi from 'joi';

const companyValidation = Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().valid('1-10', '11-20', '21-50', '51-100', '100+').required(),
    companyEmail: Joi.string().email().required(),
});

const updateCompanyValidation = Joi.object({
    id: Joi.string().hex().required(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.string().valid('1-10', '11-20', '21-50', '51-100', '100+'),
    companyEmail: Joi.string().email(),
}).min(1);

export { companyValidation, updateCompanyValidation };
