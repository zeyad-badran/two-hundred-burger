-- ==============================================================================
-- PHASE 10: MENU MANAGEMENT SCHEMA
-- ==============================================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    sort_order integer DEFAULT 0,
    slug text UNIQUE NOT NULL,
    
    -- Localization
    name_en text NOT NULL,
    name_ar text NOT NULL,
    description_en text,
    description_ar text,
    
    category text NOT NULL,
    price numeric NOT NULL,
    currency text DEFAULT 'JOD',
    
    image_path text,
    image_url text,
    tags text[] DEFAULT '{}',
    
    is_available boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    
    CONSTRAINT price_positive CHECK (price >= 0),
    CONSTRAINT currency_check CHECK (currency = 'JOD'),
    CONSTRAINT category_not_empty CHECK (char_length(category) > 0)
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON public.menu_items (sort_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_active ON public.menu_items (is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items (is_available);

-- 3. Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Note: We are explicitly NOT creating any public access policies here.
-- All reads and writes for the menu will be securely routed through Next.js server APIs
-- using the Supabase Admin Client. This prevents direct unauthorized access.
