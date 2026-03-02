CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    visited_at TIMESTAMP DEFAULT NOW(),
    ip VARCHAR(64),
    country VARCHAR(100),
    city VARCHAR(100),
    device VARCHAR(50),
    os VARCHAR(100),
    browser VARCHAR(100),
    referrer TEXT,
    user_agent TEXT
);