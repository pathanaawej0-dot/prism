-- Run this in Neon SQL Editor to fix the UUID issue
-- This will DROP all existing tables and recreate them with correct TEXT type

DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS notebooks CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Recreate users table with TEXT id (for Clerk)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_pro BOOLEAN DEFAULT FALSE,
    neural_energy INTEGER DEFAULT 100 CHECK (neural_energy >= 0 AND neural_energy <= 100),
    last_energy_refill TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    referral_code TEXT UNIQUE,
    referred_by TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_title TEXT NOT NULL,
    content TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notebook_id INTEGER REFERENCES notebooks(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
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

-- Indexes
CREATE INDEX idx_notebooks_user_id ON notebooks(user_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
