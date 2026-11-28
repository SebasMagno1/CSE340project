import pool from '../database/pool.js';

async function getAllCategories() {
    return (
        await pool.query(`
            SELECT category_id, category_name
            FROM categories
            ORDER BY category_name
        `)
    ).rows;
}

async function getCategoryById(id) {
    return (
        await pool.query(`
            SELECT category_id, category_name
            FROM categories
            WHERE category_id = $1
        `, [id])
    ).rows[0];
}

async function getCategoriesByProjectId(id) {
    return (
        await pool.query(`
            SELECT c.category_id, c.category_name
            FROM categories c
            JOIN project_categories pc
                ON c.category_id = pc.category_id
            WHERE pc.project_id = $1
            ORDER BY c.category_name
        `, [id])
    ).rows;
}

async function getProjectsByCategoryId(id) {
    return (
        await pool.query(`
            SELECT
                p.project_id,
                p.project_name,
                p.project_description,
                p.organization_id,
                o.organization_name
            FROM projects p
            JOIN project_categories pc
                ON p.project_id = pc.project_id
            JOIN organizations o
                ON p.organization_id = o.organization_id
            WHERE pc.category_id = $1
            ORDER BY p.project_name
        `, [id])
    ).rows;
}

async function createCategory(name) {
    return (
        await pool.query(`
            INSERT INTO categories(category_name)
            VALUES($1)
            RETURNING category_id
        `, [name])
    ).rows[0].category_id;
}

async function updateCategory(id, name) {
    return (
        await pool.query(`
            UPDATE categories
            SET category_name = $1
            WHERE category_id = $2
            RETURNING category_id
        `, [name, id])
    ).rows[0];
}

async function assignCategoryToProject(projectId, categoryId) {
    await pool.query(`
        INSERT INTO project_categories(project_id, category_id)
        VALUES($1, $2)
        ON CONFLICT DO NOTHING
    `, [projectId, categoryId]);
}

async function updateCategoryAssignments(projectId, categoryIds) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        await client.query(`
            DELETE FROM project_categories
            WHERE project_id = $1
        `, [projectId]);

        for (const categoryId of categoryIds) {
            await client.query(`
                INSERT INTO project_categories(project_id, category_id)
                VALUES($1, $2)
                ON CONFLICT DO NOTHING
            `, [projectId, categoryId]);
        }

        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createCategory,
    updateCategory,
    assignCategoryToProject,
    updateCategoryAssignments
};