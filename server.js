
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';

// Port configuration
const PORT = process.env.PORT || 3000;

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Configure EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    const title = 'Home';
    res.render('index', { title });
});

// Organizations route
app.get('/organizations', (req, res) => {
    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

// Projects route
app.get('/projects', (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

// Categories route
app.get('/categories', (req, res) => {
    const title = 'Service Project Categories';
    res.render('categories', { title });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
