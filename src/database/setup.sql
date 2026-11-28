DROP TABLE IF EXISTS project_categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;


CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL UNIQUE,
    organization_description TEXT NOT NULL,
    organization_email VARCHAR(255),
    organization_logo VARCHAR(255)
);


CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(120) NOT NULL,
    project_description TEXT NOT NULL,
    project_date DATE NOT NULL,
    project_location VARCHAR(150) NOT NULL,
    organization_id INTEGER NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(organization_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


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

-- Organizations.
INSERT INTO organizations (
    organization_name,
    organization_description,
    organization_email,
    organization_logo
)
VALUES
(
    'BrightFuture Builders',
    'Helping communities build brighter futures.',
    'info@brightfuture.org',
    '/images/brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'Supporting sustainable communities and agriculture.',
    'contact@greenharvest.org',
    '/images/greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'Connecting volunteers with meaningful service.',
    'hello@unityserve.org',
    '/images/unityserve-logo.png'
);

-- Projects.
INSERT INTO projects (
    project_name,
    project_description,
    project_date,
    project_location,
    organization_id
)
VALUES
(
    'Park Cleanup',
    'Join us to clean up local parks and make them beautiful!',
    CURRENT_DATE + 7,
    'Community Park',
    (
        SELECT organization_id
        FROM organizations
        WHERE organization_name = 'GreenHarvest Growers'
    )
),
(
    'Food Drive',
    'Help collect and distribute food to those in need.',
    CURRENT_DATE + 14,
    'Community Food Center',
    (
        SELECT organization_id
        FROM organizations
        WHERE organization_name = 'UnityServe Volunteers'
    )
),
(
    'Community Tutoring',
    'Volunteer to tutor students in various subjects.',
    CURRENT_DATE + 21,
    'Public Library',
    (
        SELECT organization_id
        FROM organizations
        WHERE organization_name = 'BrightFuture Builders'
    )
);

-- Categories.
INSERT INTO categories (category_name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');

-- Project-category relationships.
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


INSERT INTO project_categories (project_id, category_id)
SELECT p.project_id, c.category_id
FROM projects p
JOIN categories c
    ON c.category_name = 'Health and Wellness'
WHERE p.project_name = 'Food Drive';

-- Verification.
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
    