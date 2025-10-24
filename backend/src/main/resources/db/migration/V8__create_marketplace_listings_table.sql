CREATE TABLE marketplace_listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    listing_type VARCHAR(10) NOT NULL,
    category VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_urls JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CHECK (listing_type IN ('SELL', 'BUY')),
    CHECK (category IN ('TEXTBOOKS', 'FURNITURE', 'ELECTRONICS', 'OTHER')),
    CHECK (price >= 0)
);

CREATE INDEX idx_marketplace_listings_user ON marketplace_listings(user_id);
CREATE INDEX idx_marketplace_listings_type ON marketplace_listings(listing_type);
CREATE INDEX idx_marketplace_listings_category ON marketplace_listings(category);
CREATE INDEX idx_marketplace_listings_created ON marketplace_listings(created_at DESC);


