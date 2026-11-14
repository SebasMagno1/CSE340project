
import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { getAllOrganizations }
    from './src/models/organizations.js';

import { getAllProjects }
    from './src/models/projects.js';

import { getAllCategories }
    from './src/models/categories.js';

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// EJS configuration
app.set('view engine', 'ejs');

app.set(
    'views',
    path.join(__dirname, 'src', 'views')
);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HOME ROUTE
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});

// ORGANIZATIONS ROUTE
app.get('/organizations', async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('organizations', {
            title: 'Our Partner Organizations',
            organizations
        });

    } catch (error) {
        next(error);
    }
});

// PROJECTS ROUTE
app.get('/projects', async (req, res, next) => {
    try {
        const projects = await getAllProjects();

        res.render('projects', {
            title: 'Service Projects',
            projects
        });

    } catch (error) {
        next(error);
    }
});

// CATEGORIES ROUTE
app.get('/categories', async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Service Project Categories',
            categories
        });

    } catch (error) {
        next(error);
    }
});

// ERROR HANDLER
app.use((error, req, res, next) => {
    console.error('Application error:', error);

    res.status(500).send(
        'Sorry, something went wrong while loading this page.'
    );
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
