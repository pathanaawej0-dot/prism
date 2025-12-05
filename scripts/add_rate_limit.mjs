import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
    console.log('Starting migration...')
    try {
        await sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS message_count_today INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS last_message_date DATE DEFAULT CURRENT_DATE;
    `
        console.log('Migration successful!')
    } catch (error) {
        console.error('Migration failed:', error)
    }
}

migrate()
