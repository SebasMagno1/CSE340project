
import pool from '../database/pool.js';

// Get all partner organizations
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

export { getAllOrganizations };
