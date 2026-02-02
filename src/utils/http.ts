import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { v4 as uuidv4 } from 'uuid';
import i18n from '@/plugins/i18n';
import { OAUTH2_CONFIG } from './constants';
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

// 刷新 Token 相关变量
let isRefreshing = false;
let requestsQueue: Array<() => void> = [];

/**
 * 刷新 Token
 */
async function handleRefreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const { clientId, clientSecret } = OAUTH2_CONFIG;
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', refreshToken);

  // 使用 http 实例自身发送请求，以便自动签名
  // 注意：需要避免死循环，拦截器中需判断是否为刷新请求
  const response = await http.post(
    `${ServicePrefix.IAM}/oauth2/token`,
    formData.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  // 拦截器已经返回了 response.data (即响应体)
  const res = response as any;
  // 如果是统一包装格式，取 .data；否则直接返回
  if (res && typeof res === 'object' && 'successful' in res) {
    return res.data;
  }
  return res;
}

// 请求拦截器
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 添加 Token
    const token = localStorage.getItem('token');
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. 接口签名逻辑
    const timestamp = Date.now().toString();
    const requestId = uuidv4();

    // 获取签名路径
    // config.url 通常就是我们传入的相对路径 (e.g. /iam/login)
    // 签名路径不应包含服务前缀 (ServicePrefix)
    let signaturePath = config.url || '';

    // 移除服务前缀
    for (const prefix of Object.values(ServicePrefix)) {
      if (signaturePath.startsWith(prefix)) {
        signaturePath = signaturePath.replace(prefix, '');
      }
    }

    // 确保 path 以 / 开头
    if (!signaturePath.startsWith('/')) {
      signaturePath = '/' + signaturePath;
    }

    // 将 query params 拼接到 signaturePath (需排序以保证一致性)

    if (config.params) {
      // 过滤掉 undefined 和 null，防止被 URLSearchParams 转为字符串 "undefined"

      const params = { ...config.params };

      for (const key of Object.keys(params)) {
        if (params[key] === undefined || params[key] === null) {
          delete params[key];
        }
      }

      const searchParams = new URLSearchParams(params);

      const queryString = decodeURIComponent(
        searchParams.toString().replace(/\+/g, '%20'),
      );

      if (queryString) {
        signaturePath +=
          (signaturePath.includes('?') ? '&' : '?') + queryString;
      }
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
    const secretKey = OAUTH2_CONFIG.clientSecret;
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
        const errorMsg = wrapper.message || i18n.global.t('http.systemError');
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
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    let messageStr = i18n.global.t('http.unknownError');

    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data as any;

      // Prioritize backend-provided message from ResponseWrapper or direct message field
      if (
        responseData &&
        typeof responseData === 'object' &&
        responseData.message
      ) {
        messageStr = responseData.message;
      }

      // 401 处理 (Token 过期刷新)
      if (status === 401 && config) {
        // 如果是刷新 Token 的请求本身报错，或者没有 refresh_token，直接登出
        const isRefreshTokenRequest =
          config.url?.includes('/oauth2/token') &&
          config.data?.includes('grant_type=refresh_token');

        if (isRefreshTokenRequest) {
          localStorage.clear();
          window.location.href = '/auth/login';
          throw error;
        }

        if (isRefreshing) {
          // 正在刷新，将请求加入队列
          return new Promise((resolve) => {
            requestsQueue.push(() => {
              if (config.headers) {
                delete config.headers.Authorization;
              }
              if (config.baseURL && config.url?.startsWith(config.baseURL)) {
                config.url = config.url.replace(config.baseURL, '');
              }
              resolve(http(config));
            });
          });
        } else {
          isRefreshing = true;

          try {
            const tokenInfo = await handleRefreshToken();
            if (tokenInfo && tokenInfo.access_token) {
              localStorage.setItem('token', tokenInfo.access_token);
              if (tokenInfo.refresh_token) {
                localStorage.setItem('refresh_token', tokenInfo.refresh_token);
              }

              // 清理 Authorization 头，让请求拦截器重新添加新 Token
              const resetConfig = (reqConfig: InternalAxiosRequestConfig) => {
                if (reqConfig.headers) {
                  delete reqConfig.headers.Authorization;
                }
                // 防止 baseURL 重复拼接
                if (
                  reqConfig.baseURL &&
                  reqConfig.url?.startsWith(reqConfig.baseURL)
                ) {
                  reqConfig.url = reqConfig.url.replace(reqConfig.baseURL, '');
                }
                return reqConfig;
              };

              // 重试队列中的请求
              for (const cb of requestsQueue) {
                // @ts-ignore
                cb(); // 队列现在的回调不需要 token 参数了，因为我们会 resetConfig
              }
              requestsQueue = [];

              // 重试当前请求
              return http(resetConfig(config));
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.clear();
            window.location.href = '/auth/login';
            throw refreshError;
          } finally {
            isRefreshing = false;
          }
        }
      }

      // If no backend message, use status-based fallback
      if (!messageStr || messageStr === i18n.global.t('http.unknownError')) {
        switch (status) {
          case 400: {
            messageStr = i18n.global.t('http.badRequest');
            break;
          }
          case 401: {
            messageStr = i18n.global.t('http.unauthorized');
            break;
          }
          case 403: {
            messageStr = i18n.global.t('http.forbidden');
            break;
          }
          case 404: {
            messageStr = i18n.global.t('http.notFound');
            break;
          }
          case 500: {
            messageStr = i18n.global.t('http.internalServerError');
            break;
          }
          default: {
            messageStr = `${i18n.global.t('http.networkError')}: ${status}`;
          }
        }
      }
    } else if (error.message.includes('timeout')) {
      messageStr = i18n.global.t('http.timeout');
    } else {
      messageStr = i18n.global.t('http.connectionError');
    }

    // Only show error message if it's NOT a handled 401 (which means we failed to refresh or it's another error)
    // But above logic handles 401 by retrying or redirecting.
    // If we are here and status is 401, it means we are redirecting (refresh failed) or it fell through (shouldn't happen for normal 401).
    // Actually, if we reject inside the 401 block, we might still want to avoid showing "Unauthorized" if we are redirecting.
    if (error.response?.status !== 401) {
      globalMessage.error(messageStr);
    }

    console.error(`[HTTP 错误] ${messageStr}`, error);
    throw error;
  },
);

export default http;
