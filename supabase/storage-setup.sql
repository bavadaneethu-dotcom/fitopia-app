-- Storage Bucket Setup SQL
-- This file contains SQL commands to create storage buckets and policies
-- Run this AFTER creating buckets in the Supabase Dashboard
-- (Bucket creation must be done via UI, but policies can be set via SQL)

-- ============================================================================
-- STORAGE BUCKET POLICIES
-- ============================================================================

-- Note: Buckets must be created manually in Supabase Dashboard first!
-- Go to Storage → New Bucket and create:
-- 1. food-evidence (Private)
-- 2. avatar-lab (Private)

-- ============================================================================
-- FOOD-EVIDENCE BUCKET POLICIES
-- ============================================================================

-- Policy: Users can upload their own food images
CREATE POLICY "Users can upload own food images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'food-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own food images
CREATE POLICY "Users can view own food images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'food-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own food images
CREATE POLICY "Users can update own food images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'food-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own food images
CREATE POLICY "Users can delete own food images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'food-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- AVATAR-LAB BUCKET POLICIES
-- ============================================================================

-- Policy: Users can upload their own avatar images
CREATE POLICY "Users can upload own avatar images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatar-lab' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own avatar images
CREATE POLICY "Users can view own avatar images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatar-lab' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own avatar images
CREATE POLICY "Users can update own avatar images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatar-lab' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar images
CREATE POLICY "Users can delete own avatar images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatar-lab' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- HELPER FUNCTION: Get public URL for storage file
-- ============================================================================

-- This function generates a signed URL for accessing private files
-- You can use this in your application code

-- Example usage in application:
-- const { data } = await supabase.storage
--   .from('food-evidence')
--   .createSignedUrl(`${userId}/${fileName}`, 3600) // 1 hour expiry

