-- LUXE Security Hardening Migration
-- Run this in Supabase SQL Editor before deploying code changes

BEGIN;

-- 1. order_items table for line-item tracking
CREATE TABLE IF NOT EXISTS public.order_items (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id    uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  uuid NOT NULL REFERENCES public.products(id),
  quantity    int  NOT NULL CHECK (quantity > 0),
  unit_price  numeric NOT NULL CHECK (unit_price >= 0),
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- 2. xp_events table with DB-enforced uniqueness
CREATE TABLE IF NOT EXISTS public.xp_events (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid NOT NULL REFERENCES auth.users(id),
  event_type    text NOT NULL,
  reference_id  text NOT NULL,
  xp_awarded    int NOT NULL CHECK (xp_awarded > 0),
  created_at    timestamptz DEFAULT now(),
  CONSTRAINT xp_events_unique_action UNIQUE (user_id, event_type, reference_id)
);
CREATE INDEX IF NOT EXISTS idx_xp_events_user_id ON public.xp_events(user_id);

-- 3. Add razorpay_order_id column to orders for direct lookup (replaces JSON scanning)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id text;
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);

-- 4. RLS for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

CREATE POLICY "Service role can manage order items"
  ON public.order_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. RLS for xp_events
ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own xp events"
  ON public.xp_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage xp events"
  ON public.xp_events FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. Postgres function for stock restoration (cancellation/expiry)
CREATE OR REPLACE FUNCTION public.restore_stock(
  p_product_id uuid,
  p_quantity int
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET stock = stock + p_quantity
  WHERE id = p_product_id;
END;
$$;

-- 7. Postgres function for releasing expired stock reservations
CREATE OR REPLACE FUNCTION public.release_expired_reservations(
  p_expiry_minutes int DEFAULT 30
) RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_order RECORD;
  total_released int := 0;
BEGIN
  FOR expired_order IN
    SELECT o.id
    FROM public.orders o
    WHERE o.status = 'Pending'
    AND o.created_at < (now() - (p_expiry_minutes || ' minutes')::interval)
  LOOP
    -- Restore stock for each item in the expired order
    UPDATE public.products p
    SET stock = p.stock + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = expired_order.id
    AND oi.product_id = p.id;
    
    -- Mark the order as cancelled
    UPDATE public.orders
    SET status = 'cancelled'
    WHERE id = expired_order.id;
    
    total_released := total_released + 1;
  END LOOP;
  
  RETURN total_released;
END;
$$;

-- 8. Valid order status transitions function
CREATE OR REPLACE FUNCTION public.validate_order_transition(
  p_current_status text,
  p_new_status text
) RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN CASE
    WHEN p_current_status = 'Pending' AND p_new_status IN ('Paid', 'cancelled', 'failed') THEN true
    WHEN p_current_status = 'Paid' AND p_new_status IN ('shipped', 'cancelled') THEN true
    WHEN p_current_status = 'shipped' AND p_new_status IN ('delivered', 'cancelled') THEN true
    WHEN p_current_status = 'delivered' AND p_new_status = 'refunded' THEN true
    WHEN p_current_status = 'processing' AND p_new_status IN ('shipped', 'cancelled') THEN true
    ELSE false
  END;
END;
$$;

-- 9. Transactional, atomic secure order creator
CREATE OR REPLACE FUNCTION public.create_order_secure(
  p_customer_id uuid,
  p_total_price numeric,
  p_delivery_address text,
  p_items jsonb, -- array of {id: uuid, quantity: int, unit_price: numeric}
  p_status text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_qty int;
  v_unit_price numeric;
  v_response jsonb;
  v_product_name text;
BEGIN
  -- 1. Create order
  INSERT INTO public.orders (customer_id, total_price, status, delivery_address)
  VALUES (p_customer_id, p_total_price, p_status, p_delivery_address)
  RETURNING id INTO v_order_id;

  -- 2. Process each item: check stock, reserve stock, insert order item
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'id')::uuid;
    v_qty := (v_item->>'quantity')::int;
    v_unit_price := (v_item->>'unit_price')::numeric;

    -- Fetch product name for helpful error message if needed
    SELECT name INTO v_product_name FROM public.products WHERE id = v_product_id;

    -- Atomic stock reserve
    UPDATE public.products
    SET stock = stock - v_qty
    WHERE id = v_product_id AND stock >= v_qty AND is_active = true;

    IF NOT FOUND THEN
      -- Stock not available or product inactive! Rollback!
      RAISE EXCEPTION 'OUT_OF_STOCK: % (Product ID: %)', COALESCE(v_product_name, 'Unknown'), v_product_id;
    END IF;

    -- Insert line item
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (v_order_id, v_product_id, v_qty, v_unit_price);
  END FOR;

  v_response := jsonb_build_object('id', v_order_id);
  RETURN v_response;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$;

COMMIT;
