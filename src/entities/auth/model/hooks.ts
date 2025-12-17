import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

      if (import.meta.env.DEV) {
        console.log('Login successful:', data.username)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Login failed:', error)
      }
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

      if (import.meta.env.DEV) {
        console.log('Logout successful')
      }
    },
    onError: (error) => {
      authStorage.clearAll()
      queryClient.clear()

      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Logout failed:', error)
      }
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) => authApi.signup(data),
    onSuccess: (data) => {
      if (!data) return
      if (import.meta.env.DEV) {
        console.log('Signup successful:', data.username)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Signup failed:', error)
      }
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
      if (import.meta.env.DEV) {
        console.log('Signup and auto-login successful')
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Signup or auto-login failed:', error)
      }
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

export function useAuthForm() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: signupWithAutoLogin, isPending: isSignupPending } = useSignupWithAutoLogin()

  const isPending = isLoginPending || isSignupPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      login(
        { username, password },
        {
          onSuccess: () => navigate('/todos'),
          onError: (error) => {
            if (import.meta.env.DEV) {
              console.error('Login error:', error)
            }
          },
        }
      )
    } else {
      signupWithAutoLogin(
        { username, password, nickname, email },
        {
          onSuccess: () => navigate('/todos'),
          onError: (error) => {
            if (import.meta.env.DEV) {
              console.error('Signup error:', error)
            }
          },
        }
      )
    }
  }

  const handleGuestMode = () => {
    authStorage.guest.set()
    navigate('/todos')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return {
    isLogin,
    username,
    email,
    nickname,
    password,
    confirmPassword,
    isPending,

    setUsername,
    setEmail,
    setNickname,
    setPassword,
    setConfirmPassword,

    handleSubmit,
    handleGuestMode,
    toggleMode,
  }
}
