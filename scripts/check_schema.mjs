import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL)

async function check() {
    console.log('Checking users table columns...')
    const usersColumns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'users';
  `
    console.log('Users columns:', usersColumns.map(c => c.column_name))

    console.log('Checking chat_sessions table columns...')
    const sessionsColumns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'chat_sessions';
  `
    console.log('Chat Sessions columns:', sessionsColumns.map(c => c.column_name))
}

check()
