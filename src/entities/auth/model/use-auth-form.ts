import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authStorage } from '@/shared/api'
import { useAuthValidation } from '../lib/useAuthValidation'
import { useLogin, useSignupWithAutoLogin } from './use-auth-mutations'

export const useAuthForm = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: signupWithAutoLogin, isPending: isSignupPending } = useSignupWithAutoLogin()

  const { errors, validators, validateSignupForm, validateLoginForm, clearError, setError } =
    useAuthValidation()

  const isPending = isLoginPending || isSignupPending

  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout)
    }
  }, [])

  const createFieldHandler = (
    field: keyof typeof errors,
    setter: (value: string) => void,
    validator?: (value: string) => string | undefined
  ) => {
    return (value: string) => {
      setter(value)

      if (timeoutRefs.current[field]) {
        clearTimeout(timeoutRefs.current[field])
      }

      timeoutRefs.current[field] = setTimeout(() => {
        if (validator && value) {
          const error = validator(value)
          if (error) {
            setError(field, error)
          } else {
            clearError(field)
          }
        } else {
          clearError(field)
        }
      }, 1000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let isValid = false
    if (isLogin) {
      isValid = validateLoginForm({ username, password })
    } else {
      isValid = validateSignupForm({ username, email, password, nickname })
    }

    if (!isValid) return

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
    authStorage.token.clear()
    authStorage.guest.set()
    navigate('/todos')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  const handleUsernameChange = createFieldHandler('username', setUsername, validators.username)
  const handleEmailChange = createFieldHandler('email', setEmail, validators.email)
  const handlePasswordChange = createFieldHandler('password', setPassword, validators.password)
  const handleNicknameChange = createFieldHandler('nickname', setNickname, validators.nickname)

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)

    if (timeoutRefs.current['confirmPassword']) {
      clearTimeout(timeoutRefs.current['confirmPassword'])
    }

    timeoutRefs.current['confirmPassword'] = setTimeout(() => {
      if (value && password) {
        if (password !== value) {
          setError('confirmPassword', t('validation.password.notMatch'))
        } else {
          clearError('confirmPassword')
        }
      } else {
        clearError('confirmPassword')
      }
    }, 1000)
  }

  const isFormValid = useMemo(() => {
    if (isLogin) {
      return (
        username.trim() !== '' && password.trim() !== '' && !errors.username && !errors.password
      )
    } else {
      return (
        username.trim() !== '' &&
        email.trim() !== '' &&
        password.trim() !== '' &&
        confirmPassword.trim() !== '' &&
        nickname.trim() !== '' &&
        !errors.username &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword &&
        !errors.nickname &&
        password === confirmPassword
      )
    }
  }, [isLogin, username, email, password, confirmPassword, nickname, errors])

  return {
    isLogin,
    username,
    email,
    nickname,
    password,
    confirmPassword,
    isPending,
    errors,
    isFormValid,

    setUsername: handleUsernameChange,
    setEmail: handleEmailChange,
    setNickname: handleNicknameChange,
    setPassword: handlePasswordChange,
    setConfirmPassword: handleConfirmPasswordChange,

    handleSubmit,
    handleGuestMode,
    toggleMode,
  }
}
