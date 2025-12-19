/**
 * Auth Handlers (Controller Layer)
 * Handles HTTP requests/responses and delegates business logic to service layer
 */
import { http, HttpResponse } from 'msw'
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../schema/auth'
import { BASE_URL } from '../utils/api-utils'
import * as authService from '../services/auth-service'

export const authHandlers = [
  // POST /auth/login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    try {
      const body = (await request.json()) as LoginRequest

      // Validate request
      if (!body.username || !body.password) {
        return HttpResponse.json({ message: 'Username and password are required' }, { status: 400 })
      }

      const result = authService.loginUser(body)

      if (!result.success) {
        return HttpResponse.json({ message: result.error }, { status: 401 })
      }

      const response: LoginResponse = {
        accessToken: result.token!,
        username: result.user!.username,
        role: result.user!.role,
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
        return HttpResponse.json({ message: 'All fields are required' }, { status: 400 })
      }

      const result = authService.registerUser(body)

      if (!result.success) {
        const status = result.error === 'Username already exists' ? 409 : 400
        return HttpResponse.json({ message: result.error }, { status })
      }

      const response: SignupResponse = {
        id: result.user!.id,
        username: result.user!.username,
        nickname: result.user!.nickname,
        email: result.user!.email,
        profileImgPath: result.user!.profileImgPath,
        role: result.user!.role,
      }

      return HttpResponse.json(response, { status: 201 })
    } catch (error) {
      console.error('Signup error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),
]
