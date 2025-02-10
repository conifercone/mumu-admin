import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APISIX, // 后端 API 地址
  timeout: 10000, // 超时时间
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
