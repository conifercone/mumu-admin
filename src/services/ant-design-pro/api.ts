// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export const AUTHORIZATION_PASSWORD_GRANT_TYPE = 'authorization_password';
export const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';
export const GRANT_TYPE_REQUEST_HEADER = 'grant_type';
export const CLIENT_ID = 'mumu-client';
export const CLIENT_PASSWORD = 'mumu';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const EXPIRES_IN = 'EXPIRES_IN';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/authentication/account/currentLoginAccount', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/authentication/account/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/authentication/oauth2/token */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  const formData = new FormData();
  formData.append('username', body.username);
  formData.append('password', body.password);
  formData.append(GRANT_TYPE_REQUEST_HEADER, AUTHORIZATION_PASSWORD_GRANT_TYPE);
  const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_PASSWORD}`);
  return request<API.LoginResult>('/api/authentication/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
    requestType: 'form',
    data: formData,
    ...(options || {}),
  });
}

/** 刷新token POST /api/authentication/oauth2/token */
export async function refreshToken(refreshToken: string, options?: { [key: string]: any }) {
  const formData = new FormData();
  formData.append(GRANT_TYPE_REQUEST_HEADER, REFRESH_TOKEN_GRANT_TYPE);
  formData.append('refresh_token', refreshToken);
  const encodedCredentials = btoa(`${CLIENT_ID}:${CLIENT_PASSWORD}`);
  return request<API.LoginResult>('/api/authentication/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
    requestType: 'form',
    data: formData,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(params, options?: { [p: string]: any }) {
  params.current = params.current - 1;
  return request<API.RuleListRes>('/api/authentication/account/findAll', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

export function setItemWithBigIntExpiry(key: string, value: any, ttl: bigint) {
  if (value !== undefined && ttl != undefined) {
    // 将当前时间戳转为 BigInt，单位为毫秒
    const now = BigInt(Date.now());

    // ttl 是以秒为单位的，需要乘以 1000 转为毫秒
    const ttlInMs = BigInt(ttl) * BigInt(1000);

    // 计算过期时间
    const item = {
      value: value,
      expiry: (now + ttlInMs).toString(), // 将 BigInt 结果转换为字符串存储
    };

    localStorage.setItem(key, JSON.stringify(item));
  }
}

export function getItemWithBigIntExpiry(key: string) {
  if (key !== undefined) {
    const itemStr = localStorage.getItem(key);

    // 如果 item 不存在，返回 null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = BigInt(Date.now()); // 将当前时间转为 BigInt

    // 检查是否过期，过期时间从字符串转换为 BigInt
    const expiry = BigInt(item.expiry);
    if (now > expiry) {
      // 数据过期，删除数据并返回 null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }
}
