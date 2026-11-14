
-- CSE340 Service Network
-- Database setup

-- Drop existing tables (fresh installation only)
DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 1. Organizations table
CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL UNIQUE,
    organization_description TEXT NOT NULL,
    organization_email VARCHAR(255),
    organization_logo VARCHAR(255)
);

-- 2. Projects table
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(120) NOT NULL,
    project_description TEXT NOT NULL,
    organization_id INTEGER NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(organization_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 3. Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Project Categories (Many-to-Many)
CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project_categories_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_project_categories_category
        FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- INSERT ORGANIZATIONS
INSERT INTO organizations
    (organization_name, organization_description,
     organization_email, organization_logo)
VALUES
    ('BrightFuture Builders',
     'Helping communities build brighter futures.',
     'info@brightfuture.org',
     '/images/brightfuture-logo.png'),

    ('GreenHarvest Growers',
     'Supporting sustainable communities and agriculture.',
     'contact@greenharvest.org',
     '/images/greenharvest-logo.png'),

    ('UnityServe Volunteers',
     'Connecting volunteers with meaningful service.',
     'hello@unityserve.org',
     '/images/unityserve-logo.png');

-- INSERT PROJECTS
INSERT INTO projects
    (project_name, project_description, organization_id)
VALUES
    ('Park Cleanup',
     'Join us to clean up local parks and make them beautiful!',
     (SELECT organization_id FROM organizations
      WHERE organization_name = 'GreenHarvest Growers')),

    ('Food Drive',
     'Help collect and distribute food to those in need.',
     (SELECT organization_id FROM organizations
      WHERE organization_name = 'UnityServe Volunteers')),

    ('Community Tutoring',
     'Volunteer to tutor students in various subjects.',
     (SELECT organization_id FROM organizations
      WHERE organization_name = 'BrightFuture Builders'));

-- INSERT CATEGORIES
INSERT INTO categories (category_name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');

-- ASSOCIATE PROJECTS WITH CATEGORIES
INSERT INTO project_categories (project_id, category_id)
SELECT p.project_id, c.category_id
FROM projects p
JOIN categories c ON
    (p.project_name = 'Park Cleanup'
        AND c.category_name = 'Environmental')
    OR
    (p.project_name = 'Food Drive'
        AND c.category_name = 'Community Service')
    OR
    (p.project_name = 'Community Tutoring'
        AND c.category_name = 'Educational');

-- Food Drive also belongs to Health and Wellness
INSERT INTO project_categories (project_id, category_id)
SELECT p.project_id, c.category_id
FROM projects p
JOIN categories c
    ON c.category_name = 'Health and Wellness'
WHERE p.project_name = 'Food Drive';

-- VERIFICATION QUERIES
SELECT * FROM organizations;
SELECT * FROM projects;
SELECT * FROM categories;

SELECT
    p.project_name,
    c.category_name
FROM project_categories pc
JOIN projects p
    ON pc.project_id = p.project_id
JOIN categories c
    ON pc.category_id = c.category_id;
