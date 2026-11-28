import 'dotenv/config';
import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';

import categoryRoute from './src/routes/categoryRoute.js';
import projectRoute from './src/routes/projectRoute.js';
import organizationRoute from './src/routes/organizationRoute.js';

import { buildHome } from './src/controllers/homeController.js';

import {
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm
} from './src/controllers/organizationController.js';

import {
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from './src/controllers/projectController.js';

import {
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm
} from './src/controllers/categoryController.js';

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.get('/', buildHome);

app.get('/new-organization', showNewOrganizationForm);
app.post('/new-organization', processNewOrganizationForm);

app.get('/edit-organization/:id', showEditOrganizationForm);
app.post('/edit-organization/:id', processEditOrganizationForm);

app.get('/new-project', showNewProjectForm);
app.post('/new-project', processNewProjectForm);

app.get('/edit-project/:id', showEditProjectForm);
app.post('/edit-project/:id', processEditProjectForm);

app.get('/assign-categories/:projectId', showAssignCategoriesForm);
app.post('/assign-categories/:projectId', processAssignCategoriesForm);

app.get('/new-category', showNewCategoryForm);
app.post('/new-category', processNewCategoryForm);

app.get('/edit-category/:id', showEditCategoryForm);
app.post('/edit-category/:id', processEditCategoryForm);

app.use('/organizations', organizationRoute);
app.use('/organization', organizationRoute);

app.use('/projects', projectRoute);
app.use('/project', projectRoute);

app.use('/categories', categoryRoute);
app.use('/category', categoryRoute);

app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: 'Page Not Found'
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) return next(error);

  res.status(500).render('errors/500', {
    title: 'Server Error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});