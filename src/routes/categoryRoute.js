import express from 'express';
import {
    buildCategoryList,
    buildCategoryDetail,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/new-category', showNewCategoryForm);
router.post('/new-category', processNewCategoryForm);

router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', processEditCategoryForm);

router.get('/', buildCategoryList);
router.get('/:id', buildCategoryDetail);

export default router;