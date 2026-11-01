-- Repair function search_path in an existing Supabase project.
-- Pinning search_path prevents a caller from shadowing objects used inside
-- SECURITY DEFINER functions (Supabase linter 0011). Both bodies only use
-- schema-qualified names or pg_catalog built-ins, so an empty path is safe.

ALTER FUNCTION public.is_admin() SET search_path = '';
ALTER FUNCTION public.handle_updated_at() SET search_path = '';
