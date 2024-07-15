import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { throwError } from "../../utils/throwerror.js";

// Add job
export const addJob = async (req, res, next) => {
    try {
        const job = new Job({ ...req.body, addedBy: req.user._id });
        await job.save();
        res.status(201).send(job);
    } catch (error) {
        next(error)
    }
};

// Update job
export const updateJob = async (req, res, next) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, addedBy: req.user._id });
        if (!job) {
            return res.status(404).send();
        }
        Object.assign(job, req.body);
        await job.save();
        res.send(job);
    } catch (error) {
        next(error)
    }
};

// Delete job
export const deleteJob = async (req, res, next) => {
    try {
        const job = await Job.findOneAndDelete({ _id: req.params.id, addedBy: req.user._id });
        if (!job) {
            return res.status(404).send();
        }
        res.send(job);
    } catch (error) {
        next(error)
    }
};

// Get all jobs with company information
export const getJobsWithCompanyInformation = async (req, res, next) => {
    try {
        const jobs = await Job.find().populate('company');
        res.send(jobs);
    } catch (error) {
        next(error)
    }
};

// Get all jobs for a specific company
export const getCompanyJobs = async (req, res, next) => {
    const { companyName } = req.query;
    try {
        const company = await Company.findOne({ companyName });
        if (!company) {
            throw throwError('no company is found with this name',404)
        }
        const jobs = await Job.find({ addedBy: company.companyHR });
        res.send(jobs);
    } catch (error) {
        next(error)
    }
};

// Get all jobs with filters
export const searchJob = async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    const filters = {};

    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.jobTitle = new RegExp(jobTitle, 'i');
    if (technicalSkills) filters.technicalSkills = { $all: technicalSkills };

    try {
        const jobs = await Job.find(filters);
        res.send(jobs);
    } catch (error) {
        next(error)
    }
};

// Apply to Job
export const ApplytoJob = async (req, res,next) => {
    const { jobId, userId, userTechSkills, userSoftSkills } = req.body;
    const userResume = req.file.path;
  
    try {
      const application = new Application({
        jobId: req.params.id,
        userId: req.user._id,
        userTechSkills,
        userSoftSkills,
        userResume
      });
      await application.save();
      res.status(201).send(application);
    } catch (error) {
        next(error);
    }
};