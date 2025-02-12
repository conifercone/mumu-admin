import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { generateCommonHeaders } from '@/apis/headers'
import axios from 'axios'

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    // 跳过响应转换
    skipTransformResponse?: boolean
  }
}

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
  const accessToken = localStorage.getItem('access_token')
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
    return response.data
  }

  // 否则走统一处理逻辑
  if (res.success) {
    return res.data
  }
  else {
    return Promise.reject(new Error(res.message || 'Error'))
  }
}

// 公共响应错误拦截逻辑
function responseErrorInterceptor(error: any) {
  return Promise.reject(error)
}

// 公共请求错误拦截逻辑
function requestErrorInterceptor(error: any) {
  return Promise.reject(error)
}

const authenticationServerApi = axios.create({
  baseURL: import.meta.env.VITE_AUTHENTICATION_SERVICE_URL,
  // 超时时间
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 使用拦截器
authenticationServerApi.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
authenticationServerApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

export default authenticationServerApi
