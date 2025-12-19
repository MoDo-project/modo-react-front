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

export interface User {
  id: number
  username: string
  password: string
  nickname: string
  email: string
  profileImgPath: string | null
  role: string
}

