export type ApiError = {
  message: string
  status: number
  errors?: Record<string, string[]>
}

type ErrorHandler = (error: ApiError) => void

const errorHandlers: ErrorHandler[] = []

export const registerErrorHandler = (handler: ErrorHandler): void => {
  errorHandlers.push(handler)
}

export const unregisterErrorHandler = (handler: ErrorHandler): void => {
  const index = errorHandlers.indexOf(handler)
  if (index > -1) {
    errorHandlers.splice(index, 1)
  }
}

export const handleUnauthorized = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')

  if (window.location.pathname !== '/auth') {
    window.location.href = '/auth'
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'status' in error && 'message' in error
}

export const handleApiError = (error: unknown): void => {
  if (!isApiError(error)) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Non-API Error:', message)
    return
  }

  if (import.meta.env.DEV) {
    console.error('API Error:', {
      status: error.status,
      message: error.message,
      errors: error.errors,
    })
  }

  switch (error.status) {
    case 401:
      handleUnauthorized()
      break
    case 403:
      console.warn('Access forbidden:', error.message)
      break
    case 404:
      console.warn('Resource not found:', error.message)
      break
    case 422:
      console.warn('Validation error:', error.errors)
      break
    case 500:
      console.error('Server error:', error.message)
      break
    default:
      console.error('Unknown error:', error.message)
  }

  errorHandlers.forEach((handler) => {
    try {
      handler(error)
    } catch (err) {
      console.error('Error in error handler:', err)
    }
  })
}

export const logRequest = (method: string, url: string, data?: unknown): void => {
  if (import.meta.env.DEV) {
    console.log(`[API ${method}]`, url, data ?? '')
  }
}

export const logResponse = (method: string, url: string, response: unknown): void => {
  if (import.meta.env.DEV) {
    console.log(`[API ${method} Response]`, url, response)
  }
}

export const shouldRefreshToken = (error: unknown): boolean => {
  return isApiError(error) && error.status === 401 && error.message.toLowerCase().includes('token')
}

export const isRetryableError = (error: unknown): boolean => {
  return (
    isApiError(error) && (error.status >= 500 || error.message.toLowerCase().includes('timeout'))
  )
}
