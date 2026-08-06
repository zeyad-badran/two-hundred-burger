-- Phase 11.5 Additions

-- Add tracking token to orders if it doesn't exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS confirmation_token uuid DEFAULT gen_random_uuid();

-- Add branch details to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS branch_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS branch_name text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS branch_address text;

-- Add delivery map details to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_lat numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_lng numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_map_url text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_address_note text;
