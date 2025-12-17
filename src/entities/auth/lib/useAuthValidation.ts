import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validators, validationMessages, type Language } from '@/shared/lib/validation'

interface ValidationErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  nickname?: string
}

export function useAuthValidation() {
  const { i18n } = useTranslation()
  const [errors, setErrors] = useState<ValidationErrors>({})

  const lang = (i18n.language || 'ko') as Language
  const messages = validationMessages[lang]

  const validateUsername = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.username.required
    }
    return undefined
  }

  const validateEmail = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.email.required
    }
    if (!validators.email(value)) {
      return messages.email.invalid
    }
    return undefined
  }

  const validatePassword = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.password.required
    }
    if (!validators.password(value)) {
      return messages.password.minLength
    }
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!validators.required(confirmPassword)) {
      return messages.password.required
    }
    if (!validators.passwordMatch(password, confirmPassword)) {
      return messages.password.notMatch
    }
    return undefined
  }

  const validateNickname = (value: string): string | undefined => {
    if (!validators.required(value)) {
      return messages.nickname.required
    }
    if (!validators.nickname(value)) {
      return messages.nickname.minLength
    }
    return undefined
  }

  const validateSignupForm = (data: {
    username: string
    email: string
    password: string
    confirmPassword: string
    nickname: string
  }): boolean => {
    const newErrors: ValidationErrors = {}

    const usernameError = validateUsername(data.username)
    if (usernameError) newErrors.username = usernameError

    const emailError = validateEmail(data.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validatePassword(data.password)
    if (passwordError) newErrors.password = passwordError

    const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword)
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError

    const nicknameError = validateNickname(data.nickname)
    if (nicknameError) newErrors.nickname = nicknameError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateLoginForm = (data: { username: string; password: string }): boolean => {
    const newErrors: ValidationErrors = {}

    const usernameError = validateUsername(data.username)
    if (usernameError) newErrors.username = usernameError

    const passwordError = validatePassword(data.password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const clearAllErrors = () => {
    setErrors({})
  }

  return {
    errors,
    validateSignupForm,
    validateLoginForm,
    clearError,
    clearAllErrors,
  }
}

