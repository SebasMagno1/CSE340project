import * as projectsModel from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

import {
    getCategoriesByProjectId,
    getAllCategories,
    updateCategoryAssignments
} from '../models/categories.js';

const valid = (v, min = 1, max = 1000) =>
    typeof v === 'string' &&
    v.trim().length >= min &&
    v.trim().length <= max;

function validate(b) {
    const e = [];

    if (!valid(b.project_name, 3, 120))
        e.push('Project name must be 3–120 characters.');

    if (!valid(b.project_description, 3, 2000))
        e.push('Description must be 3–2000 characters.');

    if (!valid(b.project_location, 2, 150))
        e.push('Location must be 2–150 characters.');

    if (
        !b.project_date ||
        !/^\d{4}-\d{2}-\d{2}$/.test(b.project_date) ||
        isNaN(Date.parse(b.project_date))
    )
        e.push('Enter a valid project date.');

    if (
        !Number.isInteger(Number(b.organization_id)) ||
        Number(b.organization_id) < 1
    )
        e.push('Select an organization.');

    return e;
}

async function showNewProjectForm(req, res, next) {
    try {
        res.render('project/new', {
            title: 'New Service Project',
            project: {},
            organizations: await getAllOrganizations(),
            errors: []
        });
    } catch (e) {
        next(e);
    }
}

async function processNewProjectForm(req, res, next) {
    const e = validate(req.body);

    try {
        const orgs = await getAllOrganizations();

        if (e.length)
            return res.status(400).render('project/new', {
                title: 'New Service Project',
                project: req.body,
                organizations: orgs,
                errors: e
            });

        const id = await projectsModel.createProject(
            req.body.project_name.trim(),
            req.body.project_description.trim(),
            req.body.project_location.trim(),
            req.body.project_date,
            Number(req.body.organization_id)
        );

        req.flash('success', 'Project created.');
        res.redirect(`/project/${id}`);
    } catch (err) {
        next(err);
    }
}

async function showEditProjectForm(req, res, next) {
    try {
        const id = Number(req.params.id);
        const project = await projectsModel.getProjectDetails(id);

        if (!project)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('project/edit', {
            title: 'Edit Project',
            project,
            organizations: await getAllOrganizations(),
            errors: []
        });
    } catch (e) {
        next(e);
    }
}

async function processEditProjectForm(req, res, next) {
    const id = Number(req.params.id);
    const e = validate(req.body);

    try {
        const organizations = await getAllOrganizations();

        if (e.length)
            return res.status(400).render('project/edit', {
                title: 'Edit Project',
                project: {
                    ...req.body,
                    project_id: id
                },
                organizations,
                errors: e
            });

        await projectsModel.updateProject(
            id,
            req.body.project_name.trim(),
            req.body.project_description.trim(),
            req.body.project_location.trim(),
            req.body.project_date,
            Number(req.body.organization_id)
        );

        req.flash('success', 'Project updated.');
        res.redirect(`/project/${id}`);
    } catch (err) {
        next(err);
    }
}

async function showAssignCategoriesForm(req, res, next) {
    try {
        const id = Number(req.params.projectId);
        const project = await projectsModel.getProjectDetails(id);

        if (!project)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('project/assign-categories', {
            title: 'Assign Categories',
            project,
            categories: await getAllCategories(),
            assigned: (
                await getCategoriesByProjectId(id)
            ).map(c => c.category_id),
            errors: []
        });
    } catch (e) {
        next(e);
    }
}

async function processAssignCategoriesForm(req, res, next) {
    try {
        const id = Number(req.params.projectId);
        const project = await projectsModel.getProjectDetails(id);

        if (!project)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        let ids = req.body.category_ids || [];

        if (!Array.isArray(ids))
            ids = [ids];

        ids = ids
            .map(Number)
            .filter(n => Number.isInteger(n) && n > 0);

        const all = await getAllCategories();

        ids = ids.filter(n =>
            all.some(c => c.category_id === n)
        );

        await updateCategoryAssignments(id, ids);

        req.flash('success', 'Project categories updated.');
        res.redirect(`/project/${id}`);
    } catch (e) {
        next(e);
    }
}

async function buildProjectList(req, res, next) {
    try {
        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects: await projectsModel.getUpcomingProjects(5)
        });
    } catch (e) {
        next(e);
    }
}

async function buildProjectDetail(req, res, next) {
    try {
        const id = Number(req.params.id);
        const project = await projectsModel.getProjectDetails(id);

        if (!project)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('project/detail', {
            title: project.project_name,
            project,
            categories: await getCategoriesByProjectId(id)
        });
    } catch (e) {
        next(e);
    }
}

export {
    buildProjectList,
    buildProjectDetail,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};