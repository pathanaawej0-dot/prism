import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL)

// User operations
export async function getUser(userId) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `
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
  const referralCode = generateReferralCode()
  const result = await sql`
    INSERT INTO users (id, email, referral_code)
    VALUES (${userId}, ${email}, ${referralCode})
    ON CONFLICT (id) DO UPDATE SET email = ${email}
    RETURNING *
  `
  return result[0]
}

export async function updateNeuralEnergy(userId, energy) {
  const result = await sql`
    UPDATE users 
    SET neural_energy = ${Math.min(100, Math.max(0, energy))}
    WHERE id = ${userId}
    RETURNING neural_energy
  `
  return result[0]
}

export async function decrementEnergy(userId, amount = 2) {
  const result = await sql`
    UPDATE users 
    SET neural_energy = GREATEST(0, neural_energy - ${amount})
    WHERE id = ${userId}
    RETURNING neural_energy
  `
  return result[0]
}

export async function refillEnergy(userId) {
  const user = await getUser(userId)
  if (!user) return null

  const lastRefill = new Date(user.last_energy_refill)
  const now = new Date()
  const hoursPassed = Math.floor((now - lastRefill) / (1000 * 60 * 60))
  
  if (hoursPassed > 0) {
    const energyToAdd = Math.min(hoursPassed * 5, 100 - user.neural_energy)
    const result = await sql`
      UPDATE users 
      SET neural_energy = LEAST(100, neural_energy + ${energyToAdd}),
          last_energy_refill = NOW()
      WHERE id = ${userId}
      RETURNING neural_energy
    `
    return result[0]
  }
  return { neural_energy: user.neural_energy }
}

export async function addReferralBonus(userId, referralCode) {
  const referrer = await sql`
    SELECT id FROM users WHERE referral_code = ${referralCode} AND id != ${userId}
  `
  if (referrer.length === 0) return { success: false, message: 'Invalid referral code' }

  await sql`
    UPDATE users SET referred_by = ${referrer[0].id} WHERE id = ${userId}
  `
  await sql`
    UPDATE users SET neural_energy = LEAST(100, neural_energy + 50) WHERE id = ${userId}
  `
  await sql`
    UPDATE users SET neural_energy = LEAST(100, neural_energy + 50) WHERE id = ${referrer[0].id}
  `
  return { success: true, message: '+50% Energy added!' }
}

// Notebook operations
export async function getNotebooks(userId) {
  return await sql`
    SELECT * FROM notebooks WHERE user_id = ${userId} ORDER BY updated_at DESC
  `
}

export async function getNotebook(notebookId, userId) {
  const result = await sql`
    SELECT * FROM notebooks WHERE id = ${notebookId} AND user_id = ${userId}
  `
  return result[0]
}

export async function createNotebook(userId, topicTitle) {
  const result = await sql`
    INSERT INTO notebooks (user_id, topic_title, content)
    VALUES (${userId}, ${topicTitle}, '')
    RETURNING *
  `
  return result[0]
}

export async function updateNotebook(notebookId, userId, content) {
  const result = await sql`
    UPDATE notebooks 
    SET content = ${content}
    WHERE id = ${notebookId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0]
}

export async function appendToNotebook(notebookId, userId, newContent) {
  const result = await sql`
    UPDATE notebooks 
    SET content = content || ${'\n\n' + newContent}
    WHERE id = ${notebookId} AND user_id = ${userId}
    RETURNING *
  `
  return result[0]
}

// Chat session operations
export async function createChatSession(userId, notebookId, topic) {
  const result = await sql`
    INSERT INTO chat_sessions (user_id, notebook_id, topic)
    VALUES (${userId}, ${notebookId}, ${topic})
    RETURNING *
  `
  return result[0]
}

export async function saveChatMessage(sessionId, role, content) {
  const result = await sql`
    INSERT INTO chat_messages (session_id, role, content)
    VALUES (${sessionId}, ${role}, ${content})
    RETURNING *
  `
  return result[0]
}

export async function getChatHistory(sessionId, limit = 10) {
  return await sql`
    SELECT * FROM chat_messages 
    WHERE session_id = ${sessionId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
}

// Subscription operations
export async function updateSubscription(userId, subscriptionData) {
  const result = await sql`
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
  const result = await sql`
    UPDATE users SET is_pro = ${isPro} WHERE id = ${userId} RETURNING *
  `
  return result[0]
}

// Helper functions
function generateReferralCode() {
  return 'PRISM' + Math.random().toString(36).substring(2, 8).toUpperCase()
}
