import * as model from '../models/categories.js';

const categoryNameValid = name =>
    typeof name === 'string' &&
    name.trim().length >= 3 &&
    name.trim().length <= 100;

async function buildCategoryList(req, res, next) {
    try {
        res.render('categories', {
            title: 'Service Project Categories',
            categories: await model.getAllCategories()
        });
    } catch (e) {
        next(e);
    }
}

async function buildCategoryDetail(req, res, next) {
    try {
        const id = Number(req.params.id);
        const category = await model.getCategoryById(id);

        if (!category)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('category/detail', {
            title: category.category_name,
            category,
            projects: await model.getProjectsByCategoryId(id)
        });
    } catch (e) {
        next(e);
    }
}

const showNewCategoryForm = (req, res) =>
    res.render('category/new', {
        title: 'New Category',
        category: {},
        errors: []
    });

async function processNewCategoryForm(req, res, next) {
    const name = req.body.category_name;

    if (!categoryNameValid(name))
        return res.status(400).render('category/new', {
            title: 'New Category',
            category: req.body,
            errors: [
                'Category name is required and must be 3–100 characters.'
            ]
        });

    try {
        const id = await model.createCategory(name.trim());

        req.flash('success', 'Category created.');
        res.redirect(`/category/${id}`);
    } catch (e) {
        if (e.code === '23505')
            return res.status(400).render('category/new', {
                title: 'New Category',
                category: req.body,
                errors: ['That category already exists.']
            });

        next(e);
    }
}

async function showEditCategoryForm(req, res, next) {
    try {
        const category = await model.getCategoryById(
            Number(req.params.id)
        );

        if (!category)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('category/edit', {
            title: 'Edit Category',
            category,
            errors: []
        });
    } catch (e) {
        next(e);
    }
}

async function processEditCategoryForm(req, res, next) {
    const id = Number(req.params.id);
    const name = req.body.category_name;

    if (!categoryNameValid(name))
        return res.status(400).render('category/edit', {
            title: 'Edit Category',
            category: {
                category_id: id,
                category_name: name
            },
            errors: [
                'Category name is required and must be 3–100 characters.'
            ]
        });

    try {
        await model.updateCategory(id, name.trim());

        req.flash('success', 'Category updated.');
        res.redirect(`/category/${id}`);
    } catch (e) {
        if (e.code === '23505')
            return res.status(400).render('category/edit', {
                title: 'Edit Category',
                category: {
                    category_id: id,
                    category_name: name
                },
                errors: ['That category already exists.']
            });

        next(e);
    }
}

export {
    buildCategoryList,
    buildCategoryDetail,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};
