ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS html_file_path text,
  ADD COLUMN IF NOT EXISTS html_url text;