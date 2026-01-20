import { OAUTH2_CONFIG } from '@/utils/constants';
import http, { ServicePrefix } from '@/utils/http';

export interface LoginParams {
  username?: string;
  password?: string;
  remember?: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
}

export interface UserResponse {
  id: number;
  username: string;
  nickName: string;
  email: string;
  phone?: string;
  phoneCountryCode?: string;
  gender?:
    | 'MALE'
    | 'FEMALE'
    | 'NON_BINARY'
    | 'GENDER_QUEER'
    | 'GENDER_FLUID'
    | 'AGENDER'
    | 'OTHER'
    | 'PREFER_NOT_TO_SAY';
  birthday?: string;
  bio?: string;
  avatar?: {
    id: string;
    url: string;
  };
  roles?: Array<{
    code: string;
    name: string;
  }>;
  addresses?: Array<{
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    defaultAddress?: boolean;
  }>;
}

/**
 * OAuth2 Login via IAM Service
 */
export function login(params: LoginParams) {
  // OAuth2 Password Grant parameters
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('username', params.username || '');
  formData.append('password', params.password || '');
  // Client ID/Secret can be in body or Basic Auth header.
  // Using Basic Auth is cleaner but requires manual header setting.
  // Using Body is also standard.
  // Given the "mumu-client" and "mumu" prompt, let's try Basic Auth header first as it's more secure (logs).
  // But wait, our Axios interceptor signs the body.

  // Let's use Basic Auth for client credentials
  const { clientId, clientSecret } = OAUTH2_CONFIG;
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  return http.post<TokenResponse>(
    `${ServicePrefix.IAM}/oauth2/token`,
    formData.toString(), // Send as x-www-form-urlencoded string
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`, // Override Bearer token if any
      },
    },
  );
}

/**
 * Get current login account info
 */
export function getCurrentUser() {
  return http.get<UserResponse>(
    `${ServicePrefix.IAM}/account/currentLoginAccount`,
  );
}

/**
 * Update account info
 */
export function updateAccount(data: Partial<UserResponse>) {
  return http.put(`${ServicePrefix.IAM}/account/updateById`, data);
}

/**
 * Logout
 */
export function logout() {
  return http.post(`${ServicePrefix.IAM}/account/logout`);
}
