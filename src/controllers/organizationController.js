import {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId
} from '../models/organizations.js';

// Display all organizations.
async function buildOrganizationList(req, res, next) {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations
        });
    } catch (error) {
        next(error);
    }
}

// Display one organization and its projects.
async function buildOrganizationDetail(req, res, next) {
    try {
        const organizationId = Number(req.params.id);

        if (!Number.isInteger(organizationId) || organizationId < 1) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const organization = await getOrganizationById(organizationId);

        if (!organization) {
            return res.status(404).render('errors/404', {
                title: 'Page Not Found'
            });
        }

        const projects = await getProjectsByOrganizationId(organizationId);

        return res.render('organization/detail', {
            title: organization.organization_name,
            organization,
            projects
        });
    } catch (error) {
        next(error);
    }
}

export {
    buildOrganizationList,
    buildOrganizationDetail
};