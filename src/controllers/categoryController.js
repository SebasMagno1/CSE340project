
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

// Display all categories
async function buildCategoryList(req, res, next) {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Service Project Categories',
            categories
        });
    } catch (error) {
        next(error);
    }
}

// Display category details
async function buildCategoryDetail(req, res, next) {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId < 1) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category/detail', {
            title: category.category_name,
            category,
            projects
        });

    } catch (error) {
        next(error);
    }
}

export {
    buildCategoryList,
    buildCategoryDetail
};
