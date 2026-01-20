import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { v4 as uuidv4 } from 'uuid';
import { message as globalMessage } from './message';

/**
 * 后端服务前缀枚举 (相对于 baseURL: /api/mumu)
 */
export enum ServicePrefix {
  IAM = '/iam',
  STORAGE = '/storage',
  GENIX = '/genix',
  LOG = '/log',
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
  baseURL: '/api/mumu', // 统一前缀
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 添加 Token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 接口签名逻辑
    const timestamp = Date.now().toString();
    const requestId = uuidv4();

    // 获取签名路径
    // config.url 通常就是我们传入的相对路径 (e.g. /iam/login)
    // 它默认不包含 baseURL (/api/mumu)，这正好符合我们的签名要求
    let signaturePath = config.url || '';

    // 确保 path 以 / 开头
    if (!signaturePath.startsWith('/')) {
      signaturePath = '/' + signaturePath;
    }

    // 如果有参数拼接在 URL 上 (axios paramsSerializer 之前)，这里需要注意
    // 但通常 config.url 在拦截器阶段还未包含查询参数字符串，所以这里取到的是纯 path

    // 获取 compactJsonString
    const compactJsonString = config.data
      ? typeof config.data === 'string'
        ? config.data
        : JSON.stringify(config.data)
      : '';

    // 拼接待签名字符串
    // timestampString + requestIdString + requestPath + compactJsonString
    const signaturePayload = `${timestamp}${requestId}${signaturePath}${compactJsonString}`;

    // 计算 HMAC-SHA256 签名
    const secretKey = 'mumu';
    const signature = HmacSHA256(signaturePayload, secretKey).toString();

    // 设置请求头
    if (config.headers) {
      config.headers['X-Timestamp'] = timestamp;
      config.headers['X-Request-ID'] = requestId;
      config.headers['X-Signature'] = signature;
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
    const contentType = response.headers['content-type'];
    if (
      response.config.responseType === 'blob' ||
      response.config.responseType === 'arraybuffer' ||
      (contentType && !contentType.includes('application/json'))
    ) {
      return response;
    }

    const res = response.data;

    // 判断是否为统一包装格式：检查是否存在 successful 字段
    if (res && typeof res === 'object' && 'successful' in res) {
      const wrapper = res as ResponseWrapper;
      if (wrapper.successful) {
        return res;
      } else {
        // 业务错误处理
        const errorMsg = wrapper.message || '系统错误';
        console.error(
          `[API 业务错误] 代码: ${wrapper.code}, 消息: ${errorMsg}, TraceId: ${wrapper.traceId}`,
        );
        // 显示全局错误提示
        globalMessage.error(errorMsg);
        return Promise.reject(new Error(errorMsg));
      }
    }

    // 如果没有 successful 字段，则视为非包装响应（如 OAuth2 Token），直接返回
    return res;
  },
  (error: AxiosError) => {
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

    globalMessage.error(messageStr);
    console.error(`[HTTP 错误] ${messageStr}`, error);
    return Promise.reject(error);
  },
);

export default http;
