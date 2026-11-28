import * as org from '../models/organizations.js';

const valid = (v, min = 1, max = 255) =>
    typeof v === 'string' &&
    v.trim().length >= min &&
    v.trim().length <= max;

function errors(body) {
    const e = [];

    if (!valid(body.organization_name, 3, 100))
        e.push('Organization name must be 3–100 characters.');

    if (!valid(body.organization_description, 3, 1000))
        e.push('Description must be 3–1000 characters.');

    if (
        body.organization_email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.organization_email)
    )
        e.push('Enter a valid email address.');

    return e;
}

const showNewOrganizationForm = (req, res) =>
    res.render('organization/new', {
        title: 'New Organization',
        organization: {},
        errors: []
    });

async function processNewOrganizationForm(req, res, next) {
    const e = errors(req.body);

    if (e.length)
        return res.status(400).render('organization/new', {
            title: 'New Organization',
            organization: req.body,
            errors: e
        });

    try {
        const id = await org.createOrganization(
            req.body.organization_name.trim(),
            req.body.organization_description.trim(),
            req.body.organization_email?.trim()
        );

        req.flash('success', 'Organization created.');
        res.redirect(`/organization/${id}`);
    } catch (err) {
        if (err.code === '23505')
            return res.status(400).render('organization/new', {
                title: 'New Organization',
                organization: req.body,
                errors: ['That organization name already exists.']
            });

        next(err);
    }
}

async function showEditOrganizationForm(req, res, next) {
    try {
        const organization = await org.getOrganizationById(
            Number(req.params.id)
        );

        if (!organization)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('organization/edit', {
            title: 'Edit Organization',
            organization,
            errors: []
        });
    } catch (e) {
        next(e);
    }
}

async function processEditOrganizationForm(req, res, next) {
    const id = Number(req.params.id);
    const e = errors(req.body);

    if (!Number.isInteger(id) || id < 1)
        return res.status(404).render('errors/404', {
            title: 'Not Found'
        });

    if (e.length)
        return res.status(400).render('organization/edit', {
            title: 'Edit Organization',
            organization: {
                ...req.body,
                organization_id: id
            },
            errors: e
        });

    try {
        await org.updateOrganization(
            id,
            req.body.organization_name.trim(),
            req.body.organization_description.trim(),
            req.body.organization_email?.trim()
        );

        req.flash('success', 'Organization updated.');
        res.redirect(`/organization/${id}`);
    } catch (err) {
        if (err.code === '23505')
            return res.status(400).render('organization/edit', {
                title: 'Edit Organization',
                organization: {
                    ...req.body,
                    organization_id: id
                },
                errors: ['That organization name already exists.']
            });

        next(err);
    }
}

async function buildOrganizationList(req, res, next) {
    try {
        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations: await org.getAllOrganizations()
        });
    } catch (e) {
        next(e);
    }
}

async function buildOrganizationDetail(req, res, next) {
    try {
        const id = Number(req.params.id);
        const organization = await org.getOrganizationById(id);

        if (!organization)
            return res.status(404).render('errors/404', {
                title: 'Not Found'
            });

        res.render('organization/detail', {
            title: organization.organization_name,
            organization,
            projects: await org.getProjectsByOrganizationId(id)
        });
    } catch (e) {
        next(e);
    }
}

export {
    buildOrganizationList,
    buildOrganizationDetail,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
};