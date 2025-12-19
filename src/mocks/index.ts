import { initializeData } from './data/init-data'

export async function enableMocks() {
  // Only enable mocking in development or when explicitly requested
  const shouldEnableMocks = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true'

  if (!shouldEnableMocks) {
    console.log('ℹ️ MSW mocking is disabled')
    return
  }

  // Browser only - no Node.js server support to avoid bundling issues
  if (typeof window !== 'undefined') {
    const { worker } = await import('./browser')
    await worker.start({
      onUnhandledRequest: 'warn', // Warn about unhandled requests to debug
    })
    initializeData()
    console.log('🔷 MSW worker started')
    console.log('📡 MSW will intercept requests to:', import.meta.env.VITE_API_BASE_URL || 'https://modo-api.khoon.kr/api/v1')
  }
}

export * from './schema'
export { db } from './db/db'

