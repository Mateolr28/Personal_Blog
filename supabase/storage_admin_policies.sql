-- Repair Storage write policies in an existing Supabase project.
-- Previously any authenticated user could upload, update or delete media;
-- now only users registered in public.admin_users (public.is_admin()) can.

-- Legacy permissive policies created outside schema.sql (any authenticated user
-- could write to portfolio-media). Policies are OR'ed, so they must be removed.
DROP POLICY IF EXISTS "Portfolio media authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio media authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio media authenticated delete" ON storage.objects;

DROP POLICY IF EXISTS "Admin Uploads" ON storage.objects;
CREATE POLICY "Admin Uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_admin() AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
);

DROP POLICY IF EXISTS "Admin Updates" ON storage.objects;
CREATE POLICY "Admin Updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    public.is_admin() AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
)
WITH CHECK (
    public.is_admin() AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
);

DROP POLICY IF EXISTS "Admin Deletions" ON storage.objects;
CREATE POLICY "Admin Deletions"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    public.is_admin() AND bucket_id IN ('portfolio-media', 'profile', 'projects', 'travel', 'aviation', 'general')
);

-- Check: list the active Storage policies after running this script.
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;
