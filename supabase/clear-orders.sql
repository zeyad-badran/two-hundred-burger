-- WARNING: This will permanently delete ALL orders, order items, and order notifications from your database.
-- Run this in the Supabase Dashboard SQL Editor when you want to completely wipe your test data.

-- First, delete all restaurant notifications (they depend on orders)
DELETE FROM public.restaurant_notifications;

-- Second, delete all order items (they depend on orders)
DELETE FROM public.order_items;

-- Finally, delete the orders themselves
DELETE FROM public.orders;

-- Note: The admin dashboard and kitchen dashboard will immediately reflect 0 sales and 0 orders after running this.
