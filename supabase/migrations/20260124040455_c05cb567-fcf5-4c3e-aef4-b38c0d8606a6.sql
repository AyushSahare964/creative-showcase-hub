-- Create storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Allow authenticated users to update their own videos
CREATE POLICY "Authenticated users can update videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'videos');

-- Allow authenticated users to delete videos
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'videos');

-- Allow public to view videos
CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'videos');