import { http, HttpResponse } from 'msw'
import { db } from '../db/db'
import { verifyPassword, generateToken } from '../db/utils'
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../schema/auth'
import { hashPassword } from '../db/utils'

// Match the exact baseURL from apiClient
const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_BASE_URL || 'https://modo-api.khoon.kr/api/v1'
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}
const BASE_URL = getBaseURL()

export const authHandlers = [
  // POST /auth/login (v1)
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    try {
      const body = (await request.json()) as LoginRequest

      // Validate request
      if (!body.username || !body.password) {
        return HttpResponse.json(
          { message: 'Username and password are required' },
          { status: 400 }
        )
      }

      // Find user
      const user = db.getUserByUsername(body.username)
      if (!user) {
        return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      }

      // Verify password
      if (!verifyPassword(body.password, user.password)) {
        return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
      }

      // Generate token
      const token = generateToken(user.id, user.username)

      const response: LoginResponse = {
        accessToken: token,
        username: user.username,
        role: user.role,
      }

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Login error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // POST /auth/logout
  http.post(`${BASE_URL}/auth/logout`, () => {
    // In a real scenario, you might invalidate the token here
    return HttpResponse.json(null, { status: 204 })
  }),

  // POST /auth/join
  http.post(`${BASE_URL}/auth/join`, async ({ request }) => {
    try {
      const body = (await request.json()) as SignupRequest

      // Validate request
      if (!body.username || !body.password || !body.nickname || !body.email) {
        return HttpResponse.json(
          { message: 'All fields are required' },
          { status: 400 }
        )
      }

      // Check if user already exists
      const existingUser = db.getUserByUsername(body.username)
      if (existingUser) {
        return HttpResponse.json(
          { message: 'Username already exists' },
          { status: 409 }
        )
      }

      // Create new user
      const newUser = db.addUser({
        username: body.username,
        password: hashPassword(body.password),
        nickname: body.nickname,
        email: body.email,
        profileImgPath: null,
        role: 'USER',
      })

      const response: SignupResponse = {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
        email: newUser.email,
        profileImgPath: newUser.profileImgPath,
        role: newUser.role,
      }

      return HttpResponse.json(response, { status: 201 })
    } catch (error) {
      console.error('Signup error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),
]

