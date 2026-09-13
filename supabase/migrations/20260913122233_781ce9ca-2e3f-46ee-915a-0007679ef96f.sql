
CREATE POLICY "Admins manage library files" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'library-files' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'library-files' AND public.has_role(auth.uid(), 'admin'));
