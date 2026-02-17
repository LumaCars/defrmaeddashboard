-- Ensure card_orders has all columns the dashboard expects
ALTER TABLE public.card_orders ADD COLUMN IF NOT EXISTS wants_engraving boolean NOT NULL DEFAULT false;
ALTER TABLE public.card_orders ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.card_orders ADD COLUMN IF NOT EXISTS price_cents integer;
ALTER TABLE public.card_orders ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR';
