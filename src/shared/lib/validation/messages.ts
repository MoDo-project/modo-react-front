export const validationMessages = {
  ko: {
    email: {
      invalid: '올바른 이메일 형식이 아닙니다',
      required: '이메일을 입력하세요',
    },
    password: {
      minLength: '비밀번호는 8자 이상이어야 합니다',
      required: '비밀번호를 입력하세요',
      notMatch: '비밀번호가 일치하지 않습니다',
    },
    nickname: {
      minLength: '닉네임은 2자 이상이어야 합니다',
      required: '닉네임을 입력하세요',
    },
    username: {
      required: '아이디를 입력하세요',
    },
  },
  en: {
    email: {
      invalid: 'Invalid email format',
      required: 'Please enter your email',
    },
    password: {
      minLength: 'Password must be at least 8 characters',
      required: 'Please enter your password',
      notMatch: 'Passwords do not match',
    },
    nickname: {
      minLength: 'Nickname must be at least 2 characters',
      required: 'Please enter your nickname',
    },
    username: {
      required: 'Please enter your username',
    },
  },
}

export type ValidationMessages = typeof validationMessages
export type Language = keyof ValidationMessages
