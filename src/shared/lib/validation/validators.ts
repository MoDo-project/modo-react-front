export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  password: (value: string): boolean => {
    return value.length >= 8
  },

  nickname: (value: string): boolean => {
    return value.length >= 2
  },

  required: (value: string): boolean => {
    return value.trim().length > 0
  },

  passwordMatch: (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword
  },
}
