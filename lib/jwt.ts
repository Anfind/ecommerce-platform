import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { pool } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Create session in database
export async function createSession(userId: string, token: string): Promise<void> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  await pool.execute(
    'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [userId, tokenHash, expiresAt]
  )
  
  console.log(`✅ Đã tạo session cho user: ${userId}`)
}

// Delete session from database
export async function deleteSession(token: string): Promise<void> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  
  await pool.execute(
    'DELETE FROM user_sessions WHERE token_hash = ?',
    [tokenHash]
  )
  
  console.log('✅ Đã xóa session')
}

// Validate session exists in database
export async function validateSession(token: string): Promise<boolean> {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  
  const [rows] = await pool.execute(
    'SELECT id FROM user_sessions WHERE token_hash = ? AND expires_at > NOW()',
    [tokenHash]
  )
  
  return Array.isArray(rows) && rows.length > 0
}

// Clean expired sessions
export async function cleanExpiredSessions(): Promise<void> {
  const [result] = await pool.execute('DELETE FROM user_sessions WHERE expires_at <= NOW()')
  console.log(`🧹 Đã xóa ${(result as any).affectedRows} session hết hạn`)
}