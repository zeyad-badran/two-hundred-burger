-- Phase 4A: Restaurant Notifications Table (Manual / Mock Mode)

CREATE TABLE IF NOT EXISTS public.restaurant_notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    notification_type text NOT NULL DEFAULT 'new_order',
    channel text NOT NULL DEFAULT 'whatsapp',
    mode text NOT NULL DEFAULT 'manual',
    status text NOT NULL DEFAULT 'generated',
    restaurant_phone text NOT NULL,
    message text NOT NULL,
    wa_link text NOT NULL,
    provider text,
    provider_message_id text,
    sent_at timestamp with time zone,
    error_message text,

    CONSTRAINT check_channel CHECK (channel IN ('whatsapp')),
    CONSTRAINT check_mode CHECK (mode IN ('manual', 'mock', 'whatsapp_cloud', 'twilio')),
    CONSTRAINT check_status CHECK (status IN ('generated', 'opened', 'sent', 'failed', 'skipped')),
    CONSTRAINT check_notification_type CHECK (notification_type IN ('new_order', 'order_update')),
    CONSTRAINT unique_order_notification UNIQUE (order_id, notification_type)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.restaurant_notifications ENABLE ROW LEVEL SECURITY;

-- Note: All inserts/reads for this table use server-side API routes and supabaseAdmin (service role key), bypassing RLS.
