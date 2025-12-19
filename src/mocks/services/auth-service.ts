/**
 * Auth Service - Business logic for authentication operations
 */
import { db } from '../db/db'
import { hashPassword, verifyPassword, generateToken } from '../db/utils'
import type { User, LoginRequest, SignupRequest } from '../schema/auth'

/**
 * Login user and generate token
 */
export const loginUser = (
  data: LoginRequest
): { success: boolean; token?: string; user?: User; error?: string } => {
  // Find user
  const user = db.getUserByUsername(data.username)
  if (!user) {
    return { success: false, error: 'Invalid credentials' }
  }

  // Verify password
  if (!verifyPassword(data.password, user.password)) {
    return { success: false, error: 'Invalid credentials' }
  }

  // Generate token
  const token = generateToken(user.id, user.username)

  return { success: true, token, user }
}

/**
 * Register a new user
 */
export const registerUser = (
  data: SignupRequest
): { success: boolean; user?: User; error?: string } => {
  // Check if user already exists
  const existingUser = db.getUserByUsername(data.username)
  if (existingUser) {
    return { success: false, error: 'Username already exists' }
  }

  // Create new user
  const newUser = db.addUser({
    username: data.username,
    password: hashPassword(data.password),
    nickname: data.nickname,
    email: data.email,
    profileImgPath: null,
    role: 'USER',
  })

  return { success: true, user: newUser }
}

