
import pool from '../database/pool.js';

// Get a single service project by ID
async function getProjectById(projectId) {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.organization_id,
            o.organization_name
        FROM projects p
        INNER JOIN organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await pool.query(sql, [projectId]);

    return result.rows[0];
}

export { getProjectById };
