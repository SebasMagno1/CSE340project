import pool from '../database/pool.js';

const getAllOrganizations = async () => (
    await pool.query(`
        SELECT
            organization_id,
            organization_name,
            organization_description,
            organization_email,
            organization_logo
        FROM organizations
        ORDER BY organization_name
    `)
).rows;

const getOrganizationById = async id => (
    await pool.query(`
        SELECT
            organization_id,
            organization_name,
            organization_description,
            organization_email,
            organization_logo
        FROM organizations
        WHERE organization_id = $1
    `, [id])
).rows[0];

const getProjectsByOrganizationId = async id => (
    await pool.query(`
        SELECT
            project_id,
            project_name,
            project_description,
            project_date AS date,
            project_location AS location,
            organization_id
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date, project_name
    `, [id])
).rows;

const createOrganization = async (name, description, email) => (
    await pool.query(`
        INSERT INTO organizations (
            organization_name,
            organization_description,
            organization_email,
            organization_logo
        )
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id
    `, [
        name,
        description,
        email || null,
        '/images/placeholder-logo.png'
    ])
).rows[0].organization_id;

const updateOrganization = async (
    id,
    name,
    description,
    email
) => (
    await pool.query(`
        UPDATE organizations
        SET
            organization_name = $1,
            organization_description = $2,
            organization_email = $3
        WHERE organization_id = $4
        RETURNING organization_id
    `, [
        name,
        description,
        email || null,
        id
    ])
).rows[0];

export {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId,
    createOrganization,
    updateOrganization
};