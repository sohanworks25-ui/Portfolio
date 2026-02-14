-- ==========================================
-- SOHAN'S PORTFOLIO CMS - DATABASE SCHEMA
-- Target: PostgreSQL 14+
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. GLOBAL SETTINGS & SEO
CREATE TABLE site_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton record
    site_name VARCHAR(100) NOT NULL,
    logo_text VARCHAR(50) NOT NULL,
    meta_title VARCHAR(200),
    meta_description TEXT,
    keywords TEXT,
    favicon_url TEXT,
    total_views BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ADMIN AUTHENTICATION
CREATE TABLE admin_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Store bcrypt/argon2 hashes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PROFILE & IDENTITY
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    bio TEXT,
    about_me TEXT,
    photo_url TEXT,
    resume_url TEXT,
    phone VARCHAR(25),
    email VARCHAR(100),
    years_of_experience VARCHAR(20),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    sort_order INT DEFAULT 0
);

-- 5. SKILLS & COMPETENCIES
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    percentage INT CHECK (percentage BETWEEN 0 AND 100),
    sort_order INT DEFAULT 0
);

-- 6. SERVICES
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    is_enabled BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

-- 7. PORTFOLIO PROJECTS
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url TEXT,
    category VARCHAR(50) CHECK (category IN ('Web', 'App', 'Design', 'Other')),
    live_link TEXT,
    github_link TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_tech_stack (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tech_name VARCHAR(50),
    PRIMARY KEY (project_id, tech_name)
);

-- 8. CAREER & EDUCATION
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    period VARCHAR(100),
    description TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(200) NOT NULL,
    period VARCHAR(100),
    sort_order INT DEFAULT 0
);

-- 9. SOCIAL PROOF
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(100) NOT NULL,
    client_photo TEXT,
    feedback TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. COMMUNICATIONS
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. ANALYTICS
CREATE TABLE analytics_daily (
    id SERIAL PRIMARY KEY,
    day_label VARCHAR(10) NOT NULL, -- e.g., 'Mon'
    view_count INT DEFAULT 0,
    recorded_date DATE UNIQUE DEFAULT CURRENT_DATE
);

-- INDEXES
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = false;
CREATE INDEX idx_social_profile ON social_links(profile_id);
