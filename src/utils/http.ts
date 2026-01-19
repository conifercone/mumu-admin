import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { message as globalMessage } from './message';

/**
 * 后端服务前缀枚举
 */
export enum ServicePrefix {
  IAM = '/mumu/iam',
  STORAGE = '/mumu/storage',
  GENIX = '/mumu/genix',
  LOG = '/mumu/log',
}

/**
 * 后端统一响应格式
 * 对应 ResponseWrapper.java
 */
export interface ResponseWrapper<T = any> {
  successful: boolean;
  code: string;
  message: string;
  timestamp: string; // yyyy-MM-dd'T'HH:mm:ssXXX 格式的字符串
  data: T; // 可以是对象、数组或基本类型
  traceId: string;
}

// 创建 Axios 实例
const http: AxiosInstance = axios.create({
  baseURL: '/api', // 对应 vite proxy 配置
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 获取 token（根据实际存储位置调整）
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理二进制流或非 JSON 响应（如文件下载）
    const contentType = response.headers['content-type'];
    if (
      response.config.responseType === 'blob' ||
      response.config.responseType === 'arraybuffer' ||
      (contentType && !contentType.includes('application/json'))
    ) {
      return response;
    }

    const res = response.data as ResponseWrapper;

    // 根据后端 successful 字段判断业务逻辑是否成功
    if (res.successful) {
      return response; // 返回完整 response，方便在业务层处理 header 或 traceId
    } else {
      // 业务错误处理
      const errorMsg = res.message || '系统错误';
      console.error(
        `[API 业务错误] 代码: ${res.code}, 消息: ${errorMsg}, TraceId: ${res.traceId}`,
      );
      // 显示全局错误提示
      globalMessage.error(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }
  },
  (error: AxiosError) => {
    // HTTP 网络层错误处理
    let messageStr = '未知错误';
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400: {
          messageStr = '请求参数错误 (400)';
          break;
        }
        case 401: {
          messageStr = '未授权，请重新登录 (401)';
          // 此处可执行退出登录逻辑
          break;
        }
        case 403: {
          messageStr = '拒绝访问 (403)';
          break;
        }
        case 404: {
          messageStr = '资源未找到 (404)';
          break;
        }
        case 500: {
          messageStr = '服务器内部错误 (500)';
          break;
        }
        default: {
          messageStr = `网络异常: ${status}`;
        }
      }
    } else if (error.message.includes('timeout')) {
      messageStr = '请求超时，请稍后重试';
    } else {
      messageStr = '网络连接异常';
    }

    // 显示全局错误提示
    globalMessage.error(messageStr);
    console.error(`[HTTP 错误] ${messageStr}`, error);
    return Promise.reject(error);
  },
);

export default http;