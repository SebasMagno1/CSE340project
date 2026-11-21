
import pool from '../database/pool.js';

// Get all service project categories
async function getAllCategories() {
    const sql = `
        SELECT
            category_id,
            category_name
        FROM categories
        ORDER BY category_name;
    `;

    const result = await pool.query(sql);
    return result.rows;
}

// Get a single category by ID
async function getCategoryById(categoryId) {
    const sql = `
        SELECT
            category_id,
            category_name
        FROM categories
        WHERE category_id = $1;
    `;

    const result = await pool.query(sql, [categoryId]);
    return result.rows[0];
}

// Get all categories assigned to a project
async function getCategoriesByProjectId(projectId) {
    const sql = `
        SELECT
            c.category_id,
            c.category_name
        FROM categories c
        INNER JOIN project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
    `;

    const result = await pool.query(sql, [projectId]);
    return result.rows;
}

// Get all projects assigned to a category
async function getProjectsByCategoryId(categoryId) {
    const sql = `
        SELECT
            p.project_id,
            p.project_name,
            p.project_description,
            p.organization_id,
            o.organization_name
        FROM projects p
        INNER JOIN project_categories pc
            ON p.project_id = pc.project_id
        INNER JOIN organizations o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_name;
    `;

    const result = await pool.query(sql, [categoryId]);
    return result.rows;
}

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};
