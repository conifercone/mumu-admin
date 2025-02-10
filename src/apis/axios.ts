import { generateCommonHeaders } from '@/apis/headers'
import axios from 'axios'

const authenticationServerApi = axios.create({
  baseURL: import.meta.env.VITE_APISIX + import.meta.env.VITE_AUTHENTICATION_SERVICE_URL,
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器（可选：添加 Token）
authenticationServerApi.interceptors.request.use(
  (config) => {
    const commonHeaders = generateCommonHeaders(config)
    config.headers['X-Request-ID'] = commonHeaders.requestId
    config.headers['X-Signature'] = commonHeaders.signature
    config.headers['X-Timestamp'] = commonHeaders.timestamp
    return config
  },
  error => Promise.reject(error),
)

export default authenticationServerApi
