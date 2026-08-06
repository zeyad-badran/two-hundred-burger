-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    delivery_address text NOT NULL,
    notes text,
    subtotal numeric NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL
);

-- Create the order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    item_id text NOT NULL,
    item_name text NOT NULL,
    price numeric NOT NULL,
    quantity integer NOT NULL
);

-- Enable RLS (Row Level Security) but allow service role bypass (which supabaseAdmin uses)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Note: No policies are created here because the browser client shouldn't be
-- writing directly to these tables. We use the server-side API route with 
-- the SUPABASE_SECRET_KEY which bypasses RLS.
