import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { generateCommonHeaders } from '@/apis/headers'
import router from '@/router/index'
import snackbarMessagesEventBus from '@/snackbar-messages-event-bus'
import axios from 'axios'

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    // 跳过响应转换
    skipTransformResponse?: boolean
    isRefreshToken?: boolean
    serverUrl?: string
  }
}
const REFRESH_TOKEN_LOCAL_STORAGE_KEY: string = import.meta.env.VITE_REFRESH_TOKEN_LOCAL_STORAGE_KEY
const ACCESS_TOKEN_LOCAL_STORAGE_KEY: string = import.meta.env.VITE_ACCESS_TOKEN_LOCAL_STORAGE_KEY
let isRefreshing = false
let subscribers: any[] = []
export interface ResponseWrapper<T = any> {
  // 请求是否成功
  success: boolean
  // 响应编码
  code: string
  // 响应消息
  message: string
  // 时间戳
  timestamp: string
  // 响应数据
  data: T
  // 追踪ID
  traceId: string
}
// RefreshToken实体
export interface RefreshToken {
  refresh_token: string
  access_token: string
}
const serverApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // 超时时间
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 公共请求拦截逻辑
function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const commonHeaders = generateCommonHeaders(config)
  // 附加请求ID
  config.headers['X-Request-ID'] = commonHeaders.requestId
  // 附加请求签名
  config.headers['X-Signature'] = commonHeaders.signature
  // 附加请求时间戳
  config.headers['X-Timestamp'] = commonHeaders.timestamp
  // 如果token存在附加token
  const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
}

// 公共响应拦截逻辑
function responseInterceptor(response: AxiosResponse<ResponseWrapper>) {
  const config = response.config as AxiosRequestConfig & { skipTransformResponse?: boolean }
  const res = response.data

  // 如果配置了 skipTransformResponse，直接返回原始响应
  if (config.skipTransformResponse) {
    return res
  }

  // 否则走统一处理逻辑
  if (res.success) {
    return res.data
  }
  else {
    return Promise.reject(new Error(res.message || 'Error'))
  }
}

function subscribeTokenRefresh(callback: any) {
  subscribers.push(callback)
}

function onRefreshed(token: string) {
  subscribers.forEach(callback => callback(token)) // 通知所有回调使用新的 token
  subscribers = [] // 清空队列
}

// 刷新token
async function refreshToken(): Promise<RefreshToken> {
  return serverApi.postForm(`${import.meta.env.VITE_AUTHENTICATION_SERVICE_URL}/oauth2/token`, {
    refresh_token: localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY),
    grant_type: import.meta.env.VITE_REFRESH_TOKEN_GRANT_TYPE,
  }, {
    skipTransformResponse: true,
    isRefreshToken: true,
    serverUrl: import.meta.env.VITE_AUTHENTICATION_SERVICE_URL,
    auth: {
      username: import.meta.env.VITE_CLIENT_ID,
      password: import.meta.env.VITE_CLIENT_SECRET,
    },
  })
}

// 公共响应错误拦截逻辑
async function responseErrorInterceptor(error: any) {
  const originalRequest = error.config

  // 如果响应状态码是 401，并且没有正在刷新 token
  if (error.response?.status === 401) {
    if (error.config.isRefreshToken) {
      await router.push('/login')
    }
    if (!isRefreshing) {
      // 没有正在刷新 token
      if (localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY)) {
        isRefreshing = true
        try {
          const refreshTokenRes = await refreshToken()
          // 刷新 token 成功
          localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, refreshTokenRes.access_token) // 保存新 token
          localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshTokenRes.refresh_token) // 保存新 token
          onRefreshed(refreshTokenRes.access_token) // 通知所有等待的请求继续执行

          // 设置新的 Authorization 头部
          originalRequest.headers.Authorization = `Bearer ${refreshTokenRes.access_token}`

          // 重新发送请求
          return serverApi(originalRequest)
        }
        catch (refreshError) {
          // 刷新 token 失败，抛出错误
          console.error('Refresh token failed:', refreshError)
          localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY)
          localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY)
          await router.push('/login')
        }
        finally {
          isRefreshing = false
        }
      }
      else {
        // 没有刷新token跳转登录页
        await router.push('/login')
      }
    }
    else {
      // 如果正在刷新 token，则将请求添加到等待队列
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken: string) => {
          // 使用新的 token 重试请求
          serverApi({
            ...originalRequest, // 保留原始请求的配置
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`, // 设置新的 token
            },
          }).then(resolve).catch(reject) // 重试请求，resolve 或 reject
        })
      })
    }
  }
  // 通过事件总线触发 Snackbar 显示
  snackbarMessagesEventBus.showSnackbar(error.response?.data?.message || 'An unexpected error occurred', 'error')
  return Promise.reject(error)
}

// 公共请求错误拦截逻辑
function requestErrorInterceptor(error: any) {
  return Promise.reject(error)
}

// 使用拦截器
serverApi.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
serverApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

export default serverApi
