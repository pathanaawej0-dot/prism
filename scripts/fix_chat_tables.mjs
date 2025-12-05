import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
    console.log('Starting chat tables migration...')
    try {
        // Ensure chat_sessions has notebook_id
        try {
            await sql`ALTER TABLE chat_sessions ADD COLUMN notebook_id INTEGER REFERENCES notebooks(id) ON DELETE CASCADE`
            console.log('Added notebook_id to chat_sessions')
        } catch (e) {
            console.log('notebook_id error (might exist):', e.message)
        }

        // Ensure chat_messages exists
        await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
          id SERIAL PRIMARY KEY,
          session_id INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
        console.log('Ensured chat_messages table exists')

        console.log('Migration finished.')
    } catch (error) {
        console.error('Migration failed:', error)
    }
}

migrate()
