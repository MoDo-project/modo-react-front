import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginRequest, type SignupRequest } from '../api/auth-api'
import { handleApiError, authStorage } from '@/shared/api'

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      if (!data) return

      authStorage.user.set({
        username: data.username,
        role: data.role,
      })

      queryClient.invalidateQueries({ queryKey: authKeys.all })

      console.log('Login successful:', data.username)
    },
    onError: (error) => {
      handleApiError(error)
      console.error('Login failed:', error)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // authStorage.clearAll()은 이미 authApi.logout에서 호출됨
      queryClient.clear()

      console.log('Logout successful')
    },
    onError: (error) => {
      authStorage.clearAll()
      queryClient.clear()

      handleApiError(error)
      console.error('Logout failed:', error)
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (data) => {
      if (!data) return
      console.log('Signup successful:', data.username)
    },
    onError: (error) => {
      handleApiError(error)
      console.error('Signup failed:', error)
    },
  })
}

export function useSignupWithAutoLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SignupRequest & { password: string }) => {
      // 1. 회원가입
      const signupData = await authApi.signup(data)

      // 2. 자동 로그인
      const loginData = await authApi.login({
        username: data.username,
        password: data.password,
      })

      return { signup: signupData, login: loginData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all })
      console.log('Signup and auto-login successful')
    },
    onError: (error) => {
      handleApiError(error)
      console.error('Signup or auto-login failed:', error)
    },
  })
}

export function useAuthStatus() {
  const token = authStorage.token.get()
  const user = authStorage.user.get()
  const isGuest = authStorage.guest.get()

  return {
    isAuthenticated: !!token && !!user,
    isGuest,
    user,
    token,
  }
}
