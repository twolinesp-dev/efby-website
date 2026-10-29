-- EFBY BAG CATALOGUE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Collection-First Bag Catalogue System with Strict Unique Article Numbers

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Collections Table
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    display_order INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_number TEXT UNIQUE NOT NULL, -- Mandatory Unique Article Number
    model_name TEXT,
    slug TEXT UNIQUE NOT NULL,
    primary_collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    short_description TEXT,
    full_description TEXT,
    main_image TEXT NOT NULL,
    publication_status TEXT DEFAULT 'published' CHECK (publication_status IN ('draft', 'published', 'archived')),
    trending BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    launch_date DATE DEFAULT CURRENT_DATE,
    featured BOOLEAN DEFAULT false,
    display_price BOOLEAN DEFAULT false,
    price NUMERIC(10, 2),
    sale_price NUMERIC(10, 2),
    availability TEXT DEFAULT 'In Stock',
    materials TEXT,
    dimensions TEXT,
    capacity TEXT,
    weight TEXT,
    compartments TEXT,
    features TEXT,
    display_order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast searches and queries
CREATE INDEX IF NOT EXISTS idx_articles_article_number ON public.articles(article_number);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_primary_collection ON public.articles(primary_collection_id);
CREATE INDEX IF NOT EXISTS idx_articles_trending ON public.articles(trending) WHERE trending = true;
CREATE INDEX IF NOT EXISTS idx_articles_new_arrival ON public.articles(new_arrival) WHERE new_arrival = true;
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(publication_status);

-- 4. Multi-Collection Memberships (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.article_collection_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, collection_id)
);

-- 5. Article Gallery Images
CREATE TABLE IF NOT EXISTS public.article_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    colour_name TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Article Colour Variations
CREATE TABLE IF NOT EXISTS public.article_colours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    hex_code TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, name)
);

-- 7. Customer Enquiries
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    article_number TEXT NOT NULL,
    model_name TEXT,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    selected_colour TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'resolved', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Settings & Configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Homepage Sections Configuration
CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    is_enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    content_json JSONB
);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_collection_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_colours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Only published articles & non-hidden collections)
CREATE POLICY "Public collections are viewable by everyone" 
ON public.collections FOR SELECT USING (is_hidden = false);

CREATE POLICY "Published articles are viewable by everyone" 
ON public.articles FOR SELECT USING (publication_status = 'published');

CREATE POLICY "Published article memberships viewable by everyone" 
ON public.article_collection_memberships FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.articles WHERE articles.id = article_collection_memberships.article_id AND articles.publication_status = 'published')
);

CREATE POLICY "Published article images viewable by everyone" 
ON public.article_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.articles WHERE articles.id = article_images.article_id AND articles.publication_status = 'published')
);

CREATE POLICY "Published article colours viewable by everyone" 
ON public.article_colours FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.articles WHERE articles.id = article_colours.article_id AND articles.publication_status = 'published')
);

CREATE POLICY "Site settings viewable by everyone" 
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Homepage sections viewable by everyone" 
ON public.homepage_sections FOR SELECT USING (is_enabled = true);

-- Public can submit enquiries (INSERT only), but CANNOT read enquiries
CREATE POLICY "Public can submit enquiries" 
ON public.enquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full access to all tables)
CREATE POLICY "Admins have full access to collections" 
ON public.collections FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to articles" 
ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to article_collection_memberships" 
ON public.article_collection_memberships FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to article_images" 
ON public.article_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to article_colours" 
ON public.article_colours FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to enquiries" 
ON public.enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to site_settings" 
ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admins have full access to homepage_sections" 
ON public.homepage_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
