import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

dotenv.config()

async function runMigration() {
  let connectionString = process.env.DATABASE_URL
  if (connectionString && connectionString.includes('psql')) {
    const match = connectionString.match(/postgresql:\/\/[^'"]+/)
    if (match) connectionString = match[0]
  }
  if (connectionString) {
    connectionString = connectionString.replace(/^['"]|['"]$/g, '')
  }

  const sql = neon(connectionString)

  console.log('Running migration...')

  try {
    // Add columns if they don't exist
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_messages_used INTEGER DEFAULT 0`
    console.log('Added daily_messages_used column')

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_message_date DATE DEFAULT CURRENT_DATE`
    console.log('Added last_message_date column')

    // Update any NULL values
    await sql`UPDATE users SET daily_messages_used = 0 WHERE daily_messages_used IS NULL`
    await sql`UPDATE users SET last_message_date = CURRENT_DATE WHERE last_message_date IS NULL`
    console.log('Updated NULL values')

    // Verify the schema
    const columns = await sql`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `
    console.log('\nUsers table columns:')
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (default: ${col.column_default})`)
    })

    // Show current user data
    const users = await sql`SELECT id, email, is_pro, daily_messages_used, last_message_date FROM users LIMIT 5`
    console.log('\nSample user data:')
    users.forEach(u => {
      console.log(`  - ${u.email}: messages=${u.daily_messages_used}, date=${u.last_message_date}, pro=${u.is_pro}`)
    })

    console.log('\nMigration completed successfully!')
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

runMigration()
