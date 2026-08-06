-- ==============================================================================
-- PHASE 11: MENU MEDIA MANAGEMENT SCHEMA UPDATES
-- ==============================================================================

-- 1. Add image_alt_en and image_alt_ar columns for accessibility and SEO
-- We use IF NOT EXISTS to ensure the migration is idempotent.

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS image_alt_en text,
  ADD COLUMN IF NOT EXISTS image_alt_ar text;

-- Note: The existing image_path and image_url columns added in Phase 10 will 
-- now be utilized as follows:
-- image_path: Will store the relative path within the Supabase Storage bucket 
--             (e.g., 'menu-items/classic-burger/12345.webp')
-- image_url:  Will store the fully qualified public URL provided by Supabase Storage
--             (e.g., 'https://[project-ref].supabase.co/storage/v1/object/public/menu-images/...')
