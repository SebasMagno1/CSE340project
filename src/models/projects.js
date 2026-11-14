
import pool from '../database/pool.js';

// Get all service projects
async function getAllProjects() {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.organization_id,
            o.organization_name,

            COALESCE(
                STRING_AGG(
                    DISTINCT c.category_name,
                    ', ' ORDER BY c.category_name
                ),
                'Uncategorized'
            ) AS category_names

        FROM projects p

        INNER JOIN organizations o
            ON p.organization_id = o.organization_id

        LEFT JOIN project_categories pc
            ON p.project_id = pc.project_id

        LEFT JOIN categories c
            ON pc.category_id = c.category_id

        GROUP BY
            p.project_id,
            p.project_name,
            p.project_description,
            p.organization_id,
            o.organization_name

        ORDER BY p.project_id;
    `;

    const result = await pool.query(sql);

    return result.rows;
}

export { getAllProjects };
