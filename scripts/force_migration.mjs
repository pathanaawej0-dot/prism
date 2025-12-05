import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

async function migrate() {
    console.log('Starting forced migration...')
    try {
        // Add message_count_today
        try {
            await sql`ALTER TABLE users ADD COLUMN message_count_today INTEGER DEFAULT 0`
            console.log('Added message_count_today')
        } catch (e) {
            console.log('message_count_today error (might exist):', e.message)
        }

        // Add last_message_date
        try {
            await sql`ALTER TABLE users ADD COLUMN last_message_date DATE DEFAULT CURRENT_DATE`
            console.log('Added last_message_date')
        } catch (e) {
            console.log('last_message_date error (might exist):', e.message)
        }

        console.log('Migration finished.')
    } catch (error) {
        console.error('Migration failed:', error)
    }
}

migrate()
