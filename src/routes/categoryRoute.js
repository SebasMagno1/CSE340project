
import express from 'express';

import {
    buildCategoryList,
    buildCategoryDetail
} from '../controllers/categoryController.js';

const router = express.Router();

// GET /categories
router.get('/', buildCategoryList);

// GET /category/:id
router.get('/:id', buildCategoryDetail);

export default router;
