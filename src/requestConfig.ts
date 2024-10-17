import {
  ACCESS_TOKEN,
  getItemWithBigIntExpiry,
  REFRESH_TOKEN,
  refreshToken,
  setItemWithBigIntExpiry,
} from '@/services/ant-design-pro/api';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import type { AxiosResponse } from 'axios';

/**
 * @description 请求配置
 */
export const requestConfig: RequestConfig = {
  timeout: 1000,
  validateStatus: (status) => status >= 200,
  // 请求拦截器
  requestInterceptors: [
    async (url: string, options: RequestConfig) => {
      // 判断是否需要刷新token
      if (
        url !== '/api/authentication/oauth2/token' &&
        getItemWithBigIntExpiry(ACCESS_TOKEN) === null &&
        localStorage.getItem(REFRESH_TOKEN)
      ) {
        let result = await refreshToken(localStorage.getItem(REFRESH_TOKEN));
        setItemWithBigIntExpiry(ACCESS_TOKEN, result.access_token, result.expires_in);
        localStorage.setItem(REFRESH_TOKEN, result.refresh_token);
      }
      if (url !== '/api/authentication/oauth2/token' && getItemWithBigIntExpiry(ACCESS_TOKEN)) {
        const token = 'Bearer ' + getItemWithBigIntExpiry(ACCESS_TOKEN);
        options.headers = {
          ...options.headers,
          Authorization: token,
        };
      }
      return {
        url: `${url}`,
        options: { ...options },
      };
    },
  ],
  responseInterceptors: [
    (response: AxiosResponse) => {
      const { code: errorCode, message: errorMessage } = response.data;
      if (errorCode !== undefined && errorCode !== '200') {
        message.error(errorMessage);
      }
      return response;
    },
  ],
};
