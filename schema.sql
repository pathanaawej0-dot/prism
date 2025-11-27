-- PRISM Learning Platform - Neon Postgres Schema
-- Run this migration on your Neon dashboard

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,                          -- Clerk user ID
    email TEXT UNIQUE NOT NULL,
    is_pro BOOLEAN DEFAULT FALSE,
    neural_energy INTEGER DEFAULT 100 CHECK (neural_energy >= 0 AND neural_energy <= 100),
    last_energy_refill TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    referral_code TEXT UNIQUE,
    referred_by TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notebooks table (Living Notebook storage)
CREATE TABLE IF NOT EXISTS notebooks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_title TEXT NOT NULL,
    content TEXT DEFAULT '',                      -- Markdown storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions for context preservation
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notebook_id INTEGER REFERENCES notebooks(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages for history
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions tracking (Razorpay)
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    razorpay_subscription_id TEXT UNIQUE,
    razorpay_customer_id TEXT,
    plan_id TEXT NOT NULL,
    status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'trial')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notebooks_user_id ON notebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON notebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
