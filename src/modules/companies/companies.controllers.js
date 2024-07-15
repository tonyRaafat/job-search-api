import { Company } from "../../../database/models/company.model.js";
import { throwError } from "../../utils/throwerror.js";

export const addCompany = async (req, res, next) => {
    try {
        const isNotUniqueName = await Company.findOne({$or:[{companyName:req.body.companyName},{companyEmail:req.body.companyEmail}]})
        if(isNotUniqueName.companyName == req.body.companyName) throw throwError('company name already exists',400)
        if(isNotUniqueName.companyEmail == req.body.companyEmail) throw throwError('company email already exists',400)

        const company = new Company({ ...req.body, companyHR: req.user._id });
        await company.save();
        res.status(201).send(company);
        
    } catch (error) {
        next(error)
    }
}

export const updateCompany = async (req, res, next) => {
    try {
        const company = await Company.updateOne({ _id: req.params.id, companyHR: req.user._id },req.body);
        if (company.matchedCount == 0) {
            throw throwError('company not found', 404)
        }
        res.json(company);
    } catch (error) {
        next(error)
    }
}
export const deleteCompany = async (req, res, next) => {
    try {
        const company = await Company.findOneAndDelete({ _id: req.params.id, companyHR: req.user._id });
        if (!company) {
            return res.status(404).json({ error: "company not found" });
        }
        res.json(company);
    } catch (error) {
        next(error);
    }
}

export const getCompanyData = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id).populate('companyHR');
        if (!company) {
            return res.status(404).send();
        }
        res.send(company);
    } catch (error) {
        next(error)
    }
}

export const searchCompanyByName = async (req, res, next) => {
    const match = {};
    if (req.query.companyName) {
        match.companyName = new RegExp(req.query.companyName, 'i');
    }

    try {
        const companies = await Company.find(match);
        res.send(companies);
    } catch (error) {
        next(error);
    }
}