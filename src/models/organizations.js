import pool from '../database/pool.js';

// Get all partner organizations.
async function getAllOrganizations() {
    const sql = `
        SELECT
            organization_id,
            organization_name,
            organization_description,
            organization_email,
            organization_logo
        FROM organizations
        ORDER BY organization_name;
    `;

    const result = await pool.query(sql);
    return result.rows;
}

// Get one organization by ID.
async function getOrganizationById(id) {
    const sql = `
        SELECT
            organization_id,
            organization_name,
            organization_description,
            organization_email,
            organization_logo
        FROM organizations
        WHERE organization_id = $1;
    `;

    const result = await pool.query(sql, [id]);
    return result.rows[0];
}

// Get projects belonging to one organization.
async function getProjectsByOrganizationId(id) {
    const sql = `
        SELECT
            project_id,
            project_name,
            project_description,
            project_date AS date,
            project_location AS location,
            organization_id
        FROM projects
        WHERE organization_id = $1
        ORDER BY project_date ASC, project_name ASC;
    `;

    const result = await pool.query(sql, [id]);
    return result.rows;
}

export {
    getAllOrganizations,
    getOrganizationById,
    getProjectsByOrganizationId
};