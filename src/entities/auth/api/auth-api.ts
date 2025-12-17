import { apiClient, authStorage } from '@/shared/api'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  username: string
  role: string
}

export interface SignupRequest {
  username: string
  password: string
  nickname: string
  email: string
}

export interface SignupResponse {
  id: number
  username: string
  nickname: string
  email: string
  profileImgPath: string | null
  role: string
}

export const authApi = {
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)

    if (response.status === 200 && response.data) {
      authStorage.token.set(response.data.accessToken)
      authStorage.user.set({
        username: response.data.username,
        role: response.data.role,
      })
    }

    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')

    // todo logout API 나오면 응답코드 확인하고 수정하기
    if (response.status === 204 || response.status === 200) {
      authStorage.clearAll()
    }
  },

  signup: async (credentials: SignupRequest) => {
    const response = await apiClient.post<SignupResponse>('/auth/join', credentials)

    if (response.status !== 201) {
      throw new Error(`Failed to sign up ${response.status}`)
    }

    return response.data
  },
}
