import express from 'express';

import {
    buildProjectList,
    buildProjectDetail,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/new-project', showNewProjectForm);
router.post('/new-project', processNewProjectForm);

router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

router.get('/', buildProjectList);
router.get('/:id', buildProjectDetail);

export default router;
