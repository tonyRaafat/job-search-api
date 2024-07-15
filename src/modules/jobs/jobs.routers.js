import {Router} from 'express'
import { auth, authorization } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { addJob, ApplytoJob, deleteJob, getCompanyJobs, getJobsWithCompanyInformation, searchJob, updateJob } from './jobs.controllers.js';
import { applicationValidation, companyJobs, jobFilterValidation, jobValidation, updateJobValidation } from './jobs.validations.js';
import { upload } from '../../utils/upload-files.js';
import multer from 'multer';

const router = Router();

// Add job
router.post('/', auth, authorization(['Company_HR']), validate(jobValidation),addJob);

// Update job
router.put('/:id', auth, authorization(['Company_HR']), validate(updateJobValidation), updateJob);

// Delete job
router.delete('/:id', auth, authorization(['Company_HR']), deleteJob);

// Get all jobs with company information
router.get('/', auth, getJobsWithCompanyInformation);

// Get all jobs for a specific company
router.get('/company', auth,validate(companyJobs), getCompanyJobs);

// Get all jobs with filters
router.get('/search', auth, validate(jobFilterValidation), searchJob);

// Apply to Job
router.post('/:id/apply', auth,authorization(['User']), upload.single('userResume'),validate(applicationValidation),ApplytoJob);

export default router