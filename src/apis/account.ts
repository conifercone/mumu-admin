import authenticationServerApi from './axios'

// 定义账户类型
export interface AccountPasswordLogin {
  username: string
  password: string
  grant_type: string
}

// 定义token实体
export interface Token {
  refresh_token: string
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}

// 账户登录获取token
export async function passwordLogin(accountPasswordLogin: Partial<AccountPasswordLogin>): Promise<Token> {
  return authenticationServerApi.post('/oauth2/token', accountPasswordLogin, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    skipTransformResponse: true,
    auth: {
      username: import.meta.env.VITE_CLIENT_ID,
      password: import.meta.env.VITE_CLIENT_SECRET,
    },
  })
}
