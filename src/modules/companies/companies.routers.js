import { Router } from 'express';
import { auth, authorization } from '../../middlewares/auth.js';
import { addCompany, deleteCompany, getCompanyData, searchCompanyByName, updateCompany } from './companies.controllers.js';
import { companyValidation, updateCompanyValidation } from './companies.validations.js';
import { validate } from '../../middlewares/validate.js';
const router = Router();

router.post('/',auth,authorization(['Company_HR']),validate(companyValidation),addCompany)

router.put('/:id',auth,authorization(['Company_HR']),validate(updateCompanyValidation),updateCompany)

router.delete('/:id',auth,authorization(['Company_HR']),deleteCompany)

router.get('/:id',auth,authorization(['Company_HR']),getCompanyData)

router.get('/',searchCompanyByName)

export default router