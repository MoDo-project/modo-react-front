type ApiResponse<T> = {
  data: T | undefined
  status: number
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, string>
  timeoutMs?: number
}

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor() {
    const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'
    this.baseURL = raw.endsWith('/') ? raw : `${raw}/`
    this.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): URL {
    const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = new URL(normalized, this.baseURL)

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) url.searchParams.append(k, String(v))
      }
    }
    return url
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private buildHeaders(extra?: Record<string, string>, data?: unknown): Record<string, string> {
    const headers: Record<string, string> = { ...extra }

    const token = this.getToken()
    if (token) headers.Authorization = `Bearer ${token}`

    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
    if (!isFormData && data !== undefined) {
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  private buildBody(data: unknown, headers: Record<string, string>): BodyInit | undefined {
    if (data === undefined) return undefined

    if (typeof data === 'string') return data
    if (typeof Blob !== 'undefined' && data instanceof Blob) return data
    if (typeof FormData !== 'undefined' && data instanceof FormData) return data
    if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) return data

    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
    return JSON.stringify(data)
  }

  private async fetchWithTimeout(
    input: RequestInfo | URL,
    options: RequestInit,
    timeoutMs = this.timeout
  ): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(input, { ...options, signal: controller.signal })
      return res
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') throw new Error('Request timeout')
      throw e
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')
    const status = response.status
    const hasBody = status !== 204 && status !== 205

    if (!response.ok) {
      let message = `HTTP Error: ${status}`
      let errors: Record<string, string[]> | undefined

      if (hasBody && isJson) {
        const err = (await response.json().catch(() => null)) as any
        if (err && typeof err === 'object') {
          if (typeof err.message === 'string') message = err.message
          errors = err.errors
        }
      } else if (hasBody) {
        const text = await response.text().catch(() => '')
        if (text) message = text
      }

      throw { message, status, errors } as const
    }

    if (!hasBody) return { data: undefined as T, status }

    if (isJson) {
      const data = (await response.json()) as T
      return { data, status }
    }

    const text = (await response.text()) as unknown as T
    return { data: text, status }
  }

  async request<T>(endpoint: string, opts: RequestOptions = {}): Promise<ApiResponse<T>> {
    const method = opts.method ?? 'GET'
    const url = this.buildUrl(endpoint, opts.params)

    const headers = this.buildHeaders(opts.headers, opts.data)
    const body = this.buildBody(opts.data, headers)

    const res = await this.fetchWithTimeout(
      url,
      {
        method,
        headers,
        body,
      },
      opts.timeoutMs
    )

    return this.handleResponse<T>(res)
  }

  get<T>(endpoint: string, params?: Record<string, unknown>) {
    return this.request<T>(endpoint, { method: 'GET', params })
  }
  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', data })
  }
  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', data })
  }
  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', data })
  }
  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
