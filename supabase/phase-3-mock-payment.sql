-- Add new columns for payment integration if they do not exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_ref text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_provider text DEFAULT 'mock';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_payload jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamp with time zone;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;

-- Note: Current status checks usually use standard text logic, but ensure your app handles:
-- 'pending', 'paid', 'payment_failed', 'cancelled', 'preparing', 'ready', 'completed'
