import api from './axios'

// 授权服务地址
const authenticationServiceUrl = import.meta.env.VITE_AUTHENTICATION_SERVICE_URL

// 定义账户类型
export interface Account {
  id: number
  username: string
  password: string
  email: string
}

// 定义token实体
export interface Token {
  refresh_token: string
  access_token: string
}

// 账户登录获取token
export async function login(user: Partial<Account>): Promise<Token> {
  return api.post(`${authenticationServiceUrl}/oauth2/token`, user)
}
