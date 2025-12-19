/**
 * Authentication utility functions for MSW handlers
 */

/**
 * Extract user ID from Bearer token
 * Token format: mock_token_{userId}_{username}_{timestamp}
 */
export const getUserIdFromToken = (request: Request): number | null => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  // Extract user ID from mock token
  const parts = token.split('_')
  if (parts.length >= 3) {
    const userId = parseInt(parts[2])
    return isNaN(userId) ? null : userId
  }

  return null
}

/**
 * Get user ID from token or return default for testing
 */
export const getUserIdOrDefault = (request: Request, defaultUserId = 1): number => {
  let userId = getUserIdFromToken(request)

  if (!userId) {
    console.warn(
      `⚠️ MSW: No auth token found, using default user (id: ${defaultUserId}) for testing`
    )
    userId = defaultUserId
  }

  return userId
}
