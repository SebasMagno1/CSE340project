import pool from '../database/pool.js';

// Get all projects with their organization and assigned categories.
async function getAllProjects() {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.project_date AS date,
            p.project_location AS location,
            p.organization_id,
            o.organization_name,
            COALESCE(
                STRING_AGG(c.category_name, ', ' ORDER BY c.category_name),
                'Uncategorized'
            ) AS category_names
        FROM projects p
        INNER JOIN organizations o
            ON p.organization_id = o.organization_id
        LEFT JOIN project_categories pc
            ON p.project_id = pc.project_id
        LEFT JOIN categories c
            ON pc.category_id = c.category_id
        GROUP BY p.project_id, o.organization_name
        ORDER BY p.project_date ASC, p.project_name ASC;
    `;

    const result = await pool.query(sql);
    return result.rows;
}

// Get a limited number of upcoming projects.
async function getUpcomingProjects(number_of_projects) {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.project_date AS date,
            p.project_location AS location,
            p.organization_id,
            o.organization_name
        FROM projects p
        INNER JOIN organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC, p.project_name ASC
        LIMIT $1;
    `;

    const result = await pool.query(sql, [number_of_projects]);
    return result.rows;
}

// Get one project and its organization.
async function getProjectDetails(id) {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.project_date AS date,
            p.project_location AS location,
            p.organization_id,
            o.organization_name,
            o.organization_description,
            o.organization_email,
            o.organization_logo
        FROM projects p
        INNER JOIN organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await pool.query(sql, [id]);
    return result.rows[0];
}

const getProjectById = getProjectDetails;

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectById
};