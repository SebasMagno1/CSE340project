import pool from '../database/pool.js';

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
                STRING_AGG(
                    c.category_name,
                    ', ' ORDER BY c.category_name
                ),
                'Uncategorized'
            ) AS category_names
        FROM projects p
        JOIN organizations o
            ON p.organization_id = o.organization_id
        LEFT JOIN project_categories pc
            ON p.project_id = pc.project_id
        LEFT JOIN categories c
            ON pc.category_id = c.category_id
        GROUP BY p.project_id, o.organization_name
        ORDER BY p.project_date, p.project_name
    `;

    return (await pool.query(sql)).rows;
}

async function getUpcomingProjects(n) {
    return (
        await pool.query(`
            SELECT
                p.project_id,
                p.project_name,
                p.project_description,
                p.project_date AS date,
                p.project_location AS location,
                p.organization_id,
                o.organization_name
            FROM projects p
            JOIN organizations o
                ON p.organization_id = o.organization_id
            WHERE p.project_date >= CURRENT_DATE
            ORDER BY p.project_date, p.project_name
            LIMIT $1
        `, [n])
    ).rows;
}

async function getProjectDetails(id) {
    return (
        await pool.query(`
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
            JOIN organizations o
                ON p.organization_id = o.organization_id
            WHERE p.project_id = $1
        `, [id])
    ).rows[0];
}

const getProjectById = getProjectDetails;

const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => (
    await pool.query(`
        INSERT INTO projects (
            project_name,
            project_description,
            project_location,
            project_date,
            organization_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id
    `, [
        title,
        description,
        location,
        date,
        organizationId
    ])
).rows[0].project_id;

const updateProject = async (
    id,
    title,
    description,
    location,
    date,
    organizationId
) => (
    await pool.query(`
        UPDATE projects
        SET
            project_name = $1,
            project_description = $2,
            project_location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id
    `, [
        title,
        description,
        location,
        date,
        organizationId,
        id
    ])
).rows[0];

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectById,
    createProject,
    updateProject
};