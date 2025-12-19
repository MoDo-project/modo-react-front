/**
 * Generate unique ID
 */
let currentId = 1

export const generateId = (): number => {
  return currentId++
}

export const resetIdCounter = (startFrom = 1): void => {
  currentId = startFrom
}

/**
 * Simple hash function for password (for demo purposes)
 * In production, use bcrypt or similar
 */
export const hashPassword = (password: string): string => {
  return `hashed_${password}`
}

/**
 * Verify hashed password
 */
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return `hashed_${password}` === hashedPassword
}

/**
 * Generate JWT token (mock)
 */
export const generateToken = (userId: number, username: string): string => {
  return `mock_token_${userId}_${username}_${Date.now()}`
}

/**
 * Format date to ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString()
}

/**
 * Parse date from string
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString)
}

