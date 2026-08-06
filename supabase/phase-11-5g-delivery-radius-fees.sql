-- Phase 11.5G: Delivery Radius and Fees System

-- 1. Add new delivery and fee columns to the orders table safely
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_distance_km numeric,
ADD COLUMN IF NOT EXISTS delivery_fee numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS delivery_radius_km numeric,
ADD COLUMN IF NOT EXISTS is_delivery_in_range boolean,
ADD COLUMN IF NOT EXISTS branch_lat numeric,
ADD COLUMN IF NOT EXISTS branch_lng numeric;

-- 2. Add constraints to ensure data integrity
DO $$ 
BEGIN
  -- Ensure delivery_fee is never negative
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_delivery_fee_positive') THEN
    ALTER TABLE public.orders ADD CONSTRAINT chk_orders_delivery_fee_positive CHECK (delivery_fee >= 0);
  END IF;

  -- Ensure delivery_distance_km is never negative
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_delivery_distance_positive') THEN
    ALTER TABLE public.orders ADD CONSTRAINT chk_orders_delivery_distance_positive CHECK (delivery_distance_km >= 0);
  END IF;

  -- Ensure delivery_radius_km is never negative
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_delivery_radius_positive') THEN
    ALTER TABLE public.orders ADD CONSTRAINT chk_orders_delivery_radius_positive CHECK (delivery_radius_km >= 0);
  END IF;

  -- Validate latitude (-90 to 90)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_branch_lat_valid') THEN
    ALTER TABLE public.orders ADD CONSTRAINT chk_orders_branch_lat_valid CHECK (branch_lat >= -90 AND branch_lat <= 90);
  END IF;

  -- Validate longitude (-180 to 180)
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_orders_branch_lng_valid') THEN
    ALTER TABLE public.orders ADD CONSTRAINT chk_orders_branch_lng_valid CHECK (branch_lng >= -180 AND branch_lng <= 180);
  END IF;
END $$;
