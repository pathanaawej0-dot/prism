import { neon } from '@neondatabase/serverless'

let sql = null

function getSQL() {
  if (!sql) {
    let connectionString = process.env.DATABASE_URL
    if (connectionString && connectionString.includes('psql')) {
      const match = connectionString.match(/postgresql:\/\/[^'"]+/)
      if (match) connectionString = match[0]
    }
    if (connectionString) {
      connectionString = connectionString.replace(/^['"]|['"]$/g, '')
    }
    sql = neon(connectionString)
  }
  return sql
}

export { getSQL }

// User operations
export async function getUser(userId) {
  try {
    const db = getSQL()
    const result = await db`SELECT * FROM users WHERE id = ${userId}`
    return result[0] || null
  } catch (error) {
    console.error('getUser error:', error)
    return null
  }
}

export async function getOrCreateUser(userId, email) {
  let user = await getUser(userId)
  if (!user) {
    user = await createUser(userId, email || `${userId}@placeholder.com`)
  }
  return user
}

export async function createUser(userId, email) {
  const db = getSQL()
  const referralCode = 'PRISM' + Math.random().toString(36).substring(2, 8).toUpperCase()
  const result = await db`
    INSERT INTO users (id, email, referral_code, daily_messages_used, last_message_date)
    VALUES (${userId}, ${email}, ${referralCode}, 0, CURRENT_DATE)
    ON CONFLICT (id) DO UPDATE SET email = ${email}
    RETURNING *
  `
  return result[0]
}

// Ensure columns exist (run once)
let columnsChecked = false
async function ensureColumns() {
  if (columnsChecked) return
  try {
    const db = getSQL()
    await db`ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_messages_used INTEGER DEFAULT 0`
    await db`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_message_date DATE DEFAULT CURRENT_DATE`
    columnsChecked = true
  } catch (e) {
    console.log('Columns check:', e.message)
    columnsChecked = true
  }
}

// Helper to get date string in local timezone (YYYY-MM-DD)
function getLocalDateString(date) {
  if (!date) return null
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function checkAndIncrementDailyLimit(userId) {
  try {
    const db = getSQL()
    await ensureColumns()
    
    const user = await getUser(userId)
    if (!user) return { allowed: false, error: 'User not found' }
    if (user.is_pro) return { allowed: true, remaining: -1 }

    const today = getLocalDateString(new Date())
    const lastDate = user.last_message_date ? getLocalDateString(user.last_message_date) : null

    let currentCount = user.daily_messages_used || 0
    
    // Reset count if it's a new day
    if (lastDate !== today) {
      currentCount = 0
    }

    // Check if limit reached (10 messages per day)
    if (currentCount >= 10) {
      return { 
        allowed: false, 
        error: 'Daily limit reached (10 messages). Upgrade to Pro for unlimited access.',
        remaining: 0
      }
    }

    // Increment the count
    await db`
      UPDATE users 
      SET daily_messages_used = ${currentCount + 1},
          last_message_date = CURRENT_DATE
      WHERE id = ${userId}
    `

    return { allowed: true, remaining: 9 - currentCount }
  } catch (error) {
    console.error('checkAndIncrementDailyLimit error:', error)
    return { allowed: true, remaining: 10 }
  }
}

export async function getUserStats(userId) {
  try {
    await ensureColumns()
    const user = await getUser(userId)
    
    if (!user) return { isPro: false, count: 0, limit: 10 }
    
    const today = getLocalDateString(new Date())
    const lastDate = user.last_message_date ? getLocalDateString(user.last_message_date) : null
    
    // If it's a new day, count resets
    const count = lastDate === today ? (user.daily_messages_used || 0) : 0
    
    return {
      isPro: user.is_pro || false,
      count: count,
      limit: 10
    }
  } catch (error) {
    console.error('getUserStats error:', error)
    return { isPro: false, count: 0, limit: 10 }
  }
}

// Notebook operations
export async function getNotebooks(userId) {
  const db = getSQL()
  return await db`
    SELECT * FROM notebooks 
    WHERE user_id = ${userId} 
    ORDER BY updated_at DESC
  `
}

export async function getNotebook(notebookId, userId) {
  const db = getSQL()
  const result = await db`
    SELECT * FROM notebooks 
    WHERE id = ${notebookId} AND user_id = ${userId}
  `
  return result[0]
}

export async function createNotebook(userId, topicTitle) {
  const db = getSQL()
  const result = await db`
    INSERT INTO notebooks (user_id, topic_title, content)
    VALUES (${userId}, ${topicTitle}, '')
    RETURNING *
  `
  return result[0]
}

export async function updateNotebook(notebookId, userId, content) {
  const db = getSQL()
  const result = await db`
    UPDATE notebooks 
    SET content = ${content}
    WHERE id = ${notebookId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0]
}

export async function appendToNotebook(notebookId, userId, newContent) {
  const db = getSQL()
  const result = await db`
    UPDATE notebooks 
    SET content = COALESCE(content, '') || ${'\n\n' + newContent}
    WHERE id = ${notebookId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0]
}

export async function deleteNotebook(notebookId, userId) {
  const db = getSQL()
  const result = await db`
    DELETE FROM notebooks 
    WHERE id = ${notebookId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0]
}

// Chat session operations
export async function createChatSession(userId, notebookId, topic) {
  const db = getSQL()
  const result = await db`
    INSERT INTO chat_sessions (user_id, notebook_id, topic)
    VALUES (${userId}, ${notebookId}, ${topic})
    RETURNING *
  `
  return result[0]
}

export async function ensureChatSession(userId, notebookId, topic) {
  const db = getSQL()
  const sessions = await db`
    SELECT * FROM chat_sessions 
    WHERE notebook_id = ${notebookId} AND user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `
  if (sessions.length > 0) return sessions[0]
  return await createChatSession(userId, notebookId, topic)
}

export async function saveChatMessage(sessionId, role, content) {
  const db = getSQL()
  const result = await db`
    INSERT INTO chat_messages (session_id, role, content)
    VALUES (${sessionId}, ${role}, ${content})
    RETURNING *
  `
  return result[0]
}

export async function getChatHistory(sessionId) {
  const db = getSQL()
  return await db`
    SELECT * FROM chat_messages 
    WHERE session_id = ${sessionId}
    ORDER BY created_at ASC
  `
}

export async function getChatHistoryByNotebook(notebookId, userId) {
  const db = getSQL()
  const sessions = await db`
    SELECT id FROM chat_sessions 
    WHERE notebook_id = ${notebookId} AND user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 1
  `
  if (sessions.length === 0) return []
  return await getChatHistory(sessions[0].id)
}

// Subscription operations
export async function updateSubscription(userId, subscriptionData) {
  const db = getSQL()
  const result = await db`
    INSERT INTO subscriptions (user_id, razorpay_subscription_id, razorpay_customer_id, plan_id, status, trial_ends_at, current_period_end)
    VALUES (${userId}, ${subscriptionData.subscriptionId}, ${subscriptionData.customerId}, ${subscriptionData.planId}, ${subscriptionData.status}, ${subscriptionData.trialEndsAt}, ${subscriptionData.currentPeriodEnd})
    ON CONFLICT (user_id) DO UPDATE SET
      razorpay_subscription_id = ${subscriptionData.subscriptionId},
      status = ${subscriptionData.status},
      current_period_end = ${subscriptionData.currentPeriodEnd}
    RETURNING *
  `
  return result[0]
}

export async function setUserPro(userId, isPro) {
  const db = getSQL()
  const result = await db`
    UPDATE users SET is_pro = ${isPro} WHERE id = ${userId} RETURNING *
  `
  return result[0]
}

// Legacy function for backward compatibility
export async function decrementEnergy(userId, amount = 2) {
  // Now we use daily limits instead, this is kept for backward compatibility
  return { success: true }
}
