import {
  AUTHORIZATION_PASSWORD_GRANT_TYPE,
  CLIENT_ID,
  CLIENT_PASSWORD,
  GRANT_TYPE_REQUEST_HEADER,
  SERVER_URL,
  ACCESS_TOKEN,
  ID_TOKEN,
  REFRESH_TOKEN,
  EXPIRES_IN
} from '../config/constants'

export type Token = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  scope: string;
  expires_in: bigint;
  token_type: string;
}

export async function singIn(e: Event) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  formData.set(GRANT_TYPE_REQUEST_HEADER, AUTHORIZATION_PASSWORD_GRANT_TYPE)
  const auth = `${CLIENT_ID}:${CLIENT_PASSWORD}`
  const encodedCredentials = btoa(auth)
  const response = await fetch(`${SERVER_URL}/api/centaur/authentication/oauth2/token`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`
    },
    method: 'POST',
    body: formData
  })
  const token = await response.json() as Token
  localStorage.setItem(ACCESS_TOKEN, token.access_token)
  localStorage.setItem(ID_TOKEN, token.id_token)
  localStorage.setItem(REFRESH_TOKEN, token.refresh_token)
  localStorage.setItem(EXPIRES_IN, String(token.expires_in))
  if (response.ok) {
    window.location.href = '/index.html'
  }
}
