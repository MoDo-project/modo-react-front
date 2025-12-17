export { apiClient } from './client'
export * from './interceptors'
export type { ApiError } from './interceptors'

export const queryConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount: number, error: unknown) => {
        if (!error || typeof error !== 'object') return false

        const apiError = error as { status?: number }

        if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
          return false
        }

        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
}

export const buildEndpoint = (...parts: (string | number)[]) => {
  return parts.map((p) => String(p).replace(/^\/|\/$/g, '')).join('/')
}

/**
 * 인증 관련 스토리지 통합 관리
 */
export const authStorage = {
  // 토큰 관리
  token: {
    get: () => localStorage.getItem('auth_token'),
    set: (token: string) => localStorage.setItem('auth_token', token),
    clear: () => localStorage.removeItem('auth_token'),
  },

  // 사용자 정보 관리
  user: {
    get: () => {
      const data = localStorage.getItem('user')
      if (!data) return null
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    },
    set: (user: { username: string; role: string }) => {
      localStorage.setItem('user', JSON.stringify(user))
    },
    clear: () => localStorage.removeItem('user'),
  },

  // 게스트 모드
  guest: {
    get: () => localStorage.getItem('guestMode') === 'true',
    set: () => localStorage.setItem('guestMode', 'true'),
    clear: () => localStorage.removeItem('guestMode'),
  },

  // 전체 인증 데이터 클리어 (로그아웃용)
  clearAll: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('guestMode')
  },
}

// 하위 호환성을 위한 별칭
export const tokenManager = authStorage.token
