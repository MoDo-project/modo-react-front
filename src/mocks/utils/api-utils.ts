export const getBaseURL = (): string => {
  const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

export const BASE_URL = getBaseURL()
