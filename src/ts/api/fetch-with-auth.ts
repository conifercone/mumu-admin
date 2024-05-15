import {
  ACCESS_TOKEN,
  CLIENT_ID,
  CLIENT_PASSWORD, EXPIRES_IN, GRANT_TYPE_REQUEST_HEADER, ID_TOKEN, REFRESH_TOKEN,
  SERVER_URL
} from '../config/constants'

export type Token = {
  access_token: string;
  refresh_token: string;
  expires_in: bigint;
  token_type: string;
}

export async function refreshAccessToken(refreshToken: string): Promise<Token> {
  const auth = `${CLIENT_ID}:${CLIENT_PASSWORD}`
  const encodedCredentials = btoa(auth)
  const formData = new FormData()
  formData.set(GRANT_TYPE_REQUEST_HEADER, 'refresh_token')
  formData.set('refresh_token', refreshToken)
  const response = await fetch(`${SERVER_URL}/api/centaur/authentication/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCredentials}`
    },
    body: formData
  })

  if (!response.ok) {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    localStorage.removeItem(EXPIRES_IN)
    localStorage.removeItem(ID_TOKEN)
    throw new Error('Failed to refresh token')
  }

  return await response.json() as Token
}

export async function fetchWithAuth(url: RequestInfo | URL, options: RequestInit) {
  const token = localStorage.getItem(ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN)
  const headers = new Headers(options.headers ?? {})

  headers.set('Authorization', `Bearer ${token}`)
  options.headers = headers
  const response = await fetch(url, options)

  if (response.status === 401 && refreshToken) {
    try {
      const newToken = await refreshAccessToken(refreshToken)
      localStorage.setItem(ACCESS_TOKEN, newToken.access_token)
      localStorage.setItem(REFRESH_TOKEN, newToken.refresh_token)
      localStorage.setItem(EXPIRES_IN, String(newToken.expires_in))

      headers.set('Authorization', `Bearer ${newToken.access_token}`)
      return await fetch(url, options)
    } catch {
      window.location.href = '/auth/login'
    }
  }

  return response
}
