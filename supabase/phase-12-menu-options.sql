-- ==============================================================================
-- PHASE 12: MENU ITEM OPTIONS
-- ==============================================================================

-- 1. Add options column to store variant strings (e.g. "Pepsi, 7Up")
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS options jsonb DEFAULT '[]'::jsonb;

-- Example:
-- UPDATE public.menu_items SET options = '["Pepsi", "7Up", "Mirinda", "Mountain Dew"]' WHERE id = 'soft-drinks';
