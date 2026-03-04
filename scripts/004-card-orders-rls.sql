-- Enable RLS on card_orders if not already enabled
ALTER TABLE public.card_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "admins_select_card_orders" ON public.card_orders;
DROP POLICY IF EXISTS "admins_update_card_orders" ON public.card_orders;
DROP POLICY IF EXISTS "admins_insert_card_orders" ON public.card_orders;
DROP POLICY IF EXISTS "admins_delete_card_orders" ON public.card_orders;

-- Admins can read all card_orders
CREATE POLICY "admins_select_card_orders" ON public.card_orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admins can update all card_orders
CREATE POLICY "admins_update_card_orders" ON public.card_orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admins can insert card_orders
CREATE POLICY "admins_insert_card_orders" ON public.card_orders
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );

-- Admins can delete card_orders
CREATE POLICY "admins_delete_card_orders" ON public.card_orders
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
  );
