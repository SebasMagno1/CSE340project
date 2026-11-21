
import {
    getUpcomingProjects,
    getProjectDetails
} from '../models/projects.js';

import {
    getCategoriesByProjectId
} from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Display the upcoming project list.
async function buildProjectList(req, res, next) {
    try {
        const projects = await getUpcomingProjects(
            NUMBER_OF_UPCOMING_PROJECTS
        );

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects
        });
    } catch (error) {
        next(error);
    }
}

// Display one project and its categories.
async function buildProjectDetail(req, res, next) {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isInteger(projectId) || projectId < 1) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const categories = await getCategoriesByProjectId(projectId);

        return res.render('project/detail', {
            title: project.project_name,
            project,
            categories
        });

    } catch (error) {
        next(error);
    }
}

export {
    buildProjectList,
    buildProjectDetail
};