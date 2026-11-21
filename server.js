
import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


import categoryRoute from './src/routes/categoryRoute.js';
import projectRoute from './src/routes/projectRoute.js';
import organizationRoute from './src/routes/organizationRoute.js';

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// EJS configuration.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home page.
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});

// Application routes.
app.use('/organizations', organizationRoute);
app.use('/organization', organizationRoute);

app.use('/projects', projectRoute);
app.use('/project', projectRoute);

app.use('/categories', categoryRoute);
app.use('/category', categoryRoute);

// 404 handler.
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found'
    });
});

// Centralized 500 error handler.
app.use((error, req, res, next) => {
    console.error('Application error:', error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).render('errors/500', {
        title: 'Server Error'
    });
});

// Start server.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
