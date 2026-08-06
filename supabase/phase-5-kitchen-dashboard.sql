-- Phase 5: Kitchen Dashboard Indexes
-- These indexes improve the performance of fetching and filtering orders for the live kitchen dashboard.

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
