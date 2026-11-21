
import express from 'express';

import {
    buildCategoryList,
    buildCategoryDetail
} from '../controllers/categoryController.js';

const router = express.Router();


router.get('/', buildCategoryList);


router.get('/:id', buildCategoryDetail);

export default router;
