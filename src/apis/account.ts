import serverApi from './axios'

// 账户密码登录表单数据
export interface AccountPasswordLoginFormData {
  username: string
  password: string
  grant_type: string
}

// 当前登录账户信息
export interface CurrentLoginAccount {
  id: string
  username: string
  nickName: string
  avatarUrl: string
  phone: string
  email: string
  bio: string
}

// token实体
export interface Token {
  refresh_token: string
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}

// 账户密码登录
export async function passwordLogin(accountPasswordLoginFormData: Partial<AccountPasswordLoginFormData>): Promise<Token> {
  return serverApi.postForm(`${import.meta.env.VITE_AUTHENTICATION_SERVICE_URL}/oauth2/token`, accountPasswordLoginFormData, {
    skipResponseTransform: true,
    serverBaseUrl: import.meta.env.VITE_AUTHENTICATION_SERVICE_URL,
    requiresNoAuth: true,
    auth: {
      username: import.meta.env.VITE_CLIENT_ID,
      password: import.meta.env.VITE_CLIENT_SECRET,
    },
  })
}

// 获取当前登录账户信息
export async function queryCurrentLoginAccount(): Promise<CurrentLoginAccount> {
  return serverApi.get(`${import.meta.env.VITE_AUTHENTICATION_SERVICE_URL}/account/currentLoginAccount`, {
    serverBaseUrl: import.meta.env.VITE_AUTHENTICATION_SERVICE_URL,
  })
}
