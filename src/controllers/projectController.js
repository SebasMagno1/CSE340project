
import {
    getProjectById
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

// Display service project details
async function buildProjectDetail(req, res, next) {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId < 1) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const project = await getProjectById(projectId);

        if (!project) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const categories =
            await getCategoriesByProjectId(projectId);

        res.render('project/detail', {
            title: project.project_name,
            project,
            categories
        });

    } catch (error) {
        next(error);
    }
}

export { buildProjectDetail };
