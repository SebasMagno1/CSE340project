import express from 'express';

import {
    buildOrganizationList,
    buildOrganizationDetail,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
} from '../controllers/organizationController.js';

const router = express.Router();

router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', processNewOrganizationForm);

router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', processEditOrganizationForm);

router.get('/', buildOrganizationList);
router.get('/:id', buildOrganizationDetail);

export default router;