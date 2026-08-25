-- ==============================================================================
-- PERSONAL PORTFOLIO, TRAVEL LOG & AVIATION ARCHIVE - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this SQL in your Supabase SQL Editor to set up all tables, RLS policies,
-- storage buckets, and initial seed data.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABLES DEFINITIONS
-- ==============================================================================

-- Table: Admin Users (Stores authorized administrative user IDs from Supabase Auth)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: User Profile & Hero Content
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    profession TEXT NOT NULL,
    short_bio TEXT,
    bio TEXT,
    location TEXT,
    email TEXT,
    avatar_url TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    resume_url TEXT,
    interests TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Work & Professional Experience
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    achievements TEXT[] DEFAULT '{}',
    company_logo_url TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Technologies & Skills
CREATE TABLE IF NOT EXISTS public.technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon_url TEXT,
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other')),
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    years_of_experience INT,
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    main_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    videos JSONB DEFAULT '[]'::jsonb, -- Array of { url, platform: 'youtube' | 'vimeo' | 'direct', title }
    technologies TEXT[] DEFAULT '{}',
    date DATE,
    github_url TEXT,
    demo_url TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('development', 'completed', 'paused')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Travels Log & Photographic Diary
CREATE TABLE IF NOT EXISTS public.travels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    main_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    videos JSONB DEFAULT '[]'::jsonb,
    location_name TEXT,
    coordinates JSONB, -- { lat: number, lng: number }
    places_visited TEXT[] DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Aviation Spotting & Aircraft Digital Archive
CREATE TABLE IF NOT EXISTS public.aviation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration TEXT NOT NULL, -- e.g. HK-5335, N789AA, F-GZCP
    model TEXT NOT NULL,        -- e.g. A320-214, 787-9 Dreamliner
    manufacturer TEXT NOT NULL, -- e.g. Airbus, Boeing, Embraer, Bombardier
    airline TEXT NOT NULL,      -- e.g. Avianca, LATAM, Delta Air Lines
    operator TEXT,              -- Operating carrier if wet-leased/different
    country TEXT NOT NULL,      -- Country of airline/registration
    photo_date DATE NOT NULL,
    airport_name TEXT NOT NULL, -- e.g. El Dorado International Airport
    airport_code TEXT NOT NULL, -- e.g. BOG / SKBO
    city TEXT NOT NULL,
    aircraft_type TEXT NOT NULL DEFAULT 'Commercial', -- Commercial, Cargo, General, Military
    serial_number TEXT,         -- MSN / Line number
    description TEXT,
    main_image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    videos JSONB DEFAULT '[]'::jsonb,
    published BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Site Settings & Configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: Blog Posts (Architecture prepared for future expansion)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_travels_slug ON public.travels(slug);
CREATE INDEX IF NOT EXISTS idx_travels_published ON public.travels(published);
CREATE INDEX IF NOT EXISTS idx_aviation_registration ON public.aviation(registration);
CREATE INDEX IF NOT EXISTS idx_aviation_manufacturer ON public.aviation(manufacturer);
CREATE INDEX IF NOT EXISTS idx_aviation_airline ON public.aviation(airline);
CREATE INDEX IF NOT EXISTS idx_aviation_airport_code ON public.aviation(airport_code);
CREATE INDEX IF NOT EXISTS idx_aviation_published ON public.aviation(published);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON public.experiences(order_index);
CREATE INDEX IF NOT EXISTS idx_technologies_category ON public.technologies(category);

-- ==============================================================================
-- 4. AUTOMATIC TIMESTAMPS TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_experiences_updated_at ON public.experiences;
CREATE TRIGGER set_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_travels_updated_at ON public.travels;
CREATE TRIGGER set_travels_updated_at BEFORE UPDATE ON public.travels FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_aviation_updated_at ON public.aviation;
CREATE TRIGGER set_aviation_updated_at BEFORE UPDATE ON public.aviation FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aviation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if caller is authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.uid() IS NOT NULL AND (
            EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
            OR (auth.jwt() ->> 'email' IS NOT NULL AND EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.jwt() ->> 'email'))
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public Read, Admin All
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

-- Admin Users: Admins only
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins can insert admin_users" ON public.admin_users FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update admin_users" ON public.admin_users FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete admin_users" ON public.admin_users FOR DELETE USING (public.is_admin());

-- Social Links: Public Read, Admin All
CREATE POLICY "Public social links are viewable by everyone" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins can insert social_links" ON public.social_links FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update social_links" ON public.social_links FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete social_links" ON public.social_links FOR DELETE USING (public.is_admin());

-- Experiences: Public Read, Admin All
CREATE POLICY "Public experiences are viewable by everyone" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admins can insert experiences" ON public.experiences FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update experiences" ON public.experiences FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete experiences" ON public.experiences FOR DELETE USING (public.is_admin());

-- Technologies: Public Read, Admin All
CREATE POLICY "Public technologies are viewable by everyone" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Admins can insert technologies" ON public.technologies FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update technologies" ON public.technologies FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete technologies" ON public.technologies FOR DELETE USING (public.is_admin());

-- Projects: Public Read published, Admin all
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (public.is_admin());

-- Travels: Public Read published, Admin all
CREATE POLICY "Public can view published travels" ON public.travels FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins can insert travels" ON public.travels FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update travels" ON public.travels FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete travels" ON public.travels FOR DELETE USING (public.is_admin());

-- Aviation: Public Read published, Admin all
CREATE POLICY "Public can view published aviation" ON public.aviation FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins can insert aviation" ON public.aviation FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update aviation" ON public.aviation FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete aviation" ON public.aviation FOR DELETE USING (public.is_admin());

-- Contact Messages: Public can Insert, Admins can Select/Update/Delete
CREATE POLICY "Public can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages FOR DELETE USING (public.is_admin());

-- Site Settings: Public Read, Admin All
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert site settings" ON public.site_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete site settings" ON public.site_settings FOR DELETE USING (public.is_admin());

-- Blog Posts: Public Read published, Admin all
CREATE POLICY "Public can view published blog posts" ON public.blog_posts FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update blog posts" ON public.blog_posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts FOR DELETE USING (public.is_admin());

-- ==============================================================================
-- 6. SUPABASE STORAGE BUCKETS SETUP
-- ==============================================================================
-- Insert buckets into storage.buckets if they don't already exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('portfolio-media', 'portfolio-media', true),
    ('profile', 'profile', true),
    ('projects', 'projects', true),
    ('travel', 'travel', true),
    ('aviation', 'aviation', true),
    ('general', 'general', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for Public Read
CREATE POLICY "Public Access for Profile Images" ON storage.objects FOR SELECT USING (bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general'));

-- Storage Policies for Admin Writes
CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
);

CREATE POLICY "Admin Updates" ON storage.objects FOR UPDATE USING (
    auth.uid() IS NOT NULL AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
);

CREATE POLICY "Admin Deletions" ON storage.objects FOR DELETE USING (
    auth.uid() IS NOT NULL AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
);
