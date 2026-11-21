
import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import categoryRoute from './src/routes/categoryRoute.js';
import projectRoute from './src/routes/projectRoute.js';
import organizationRoute from './src/routes/organizationRoute.js';

// Home controller
import { buildHome } from './src/controllers/homeController.js';

// Server configuration
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// EJS configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get('/', buildHome);

// Organization routes
app.use('/organizations', organizationRoute);
app.use('/organization', organizationRoute);

// Project routes
app.use('/projects', projectRoute);
app.use('/project', projectRoute);

// Category routes
app.use('/categories', categoryRoute);
app.use('/category', categoryRoute);

// 404 handler
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found'
    });
});

// Centralized error handler
app.use((error, req, res, next) => {
    console.error('Application error:', error);

    if (res.headersSent) {
        return next(error);
    }

    res.status(500).render('errors/500', {
        title: 'Server Error'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
