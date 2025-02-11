import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { generateCommonHeaders } from '@/apis/headers'
import axios from 'axios'

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    skipTransformResponse?: boolean // 添加 skipTransformResponse 属性
  }
}

export interface ResponseWrapper<T = any> {
  success: boolean
  code: string
  message: string
  timestamp: string
  data: T
  traceId: string
}

// 公共请求拦截逻辑
function requestInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const commonHeaders = generateCommonHeaders(config)
  config.headers['X-Request-ID'] = commonHeaders.requestId
  config.headers['X-Signature'] = commonHeaders.signature
  config.headers['X-Timestamp'] = commonHeaders.timestamp
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
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 使用拦截器
authenticationServerApi.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
authenticationServerApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

export default authenticationServerApi
