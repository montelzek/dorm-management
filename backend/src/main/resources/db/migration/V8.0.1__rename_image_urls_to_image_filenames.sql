-- Rename image_urls to image_filenames for marketplace_listings
ALTER TABLE marketplace_listings RENAME COLUMN image_urls TO image_filenames;

