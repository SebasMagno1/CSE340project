
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';

// Define the port number
const PORT = process.env.PORT || 3000;

// Get the current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

/**
 * Configure Express middleware
 */

// Configure EJS as the view engine
app.set('view engine', 'ejs');

// Define the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Parse incoming JSON data
app.use(express.json());

/**
 * Routes
 */

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

/**
 * Start the server
 */

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
