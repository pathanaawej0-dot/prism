-- Run this to add missing columns to existing tables
-- This won't delete your existing data

-- Add daily_messages_used column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_messages_used INTEGER DEFAULT 0;

-- Add last_message_date column if it doesn't exist  
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_message_date DATE DEFAULT CURRENT_DATE;

-- Update any NULL values
UPDATE users SET daily_messages_used = 0 WHERE daily_messages_used IS NULL;
UPDATE users SET last_message_date = CURRENT_DATE WHERE last_message_date IS NULL;
