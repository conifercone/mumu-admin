// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    username?: string;
    avatarUrl?: string;
    id?: number;
    email?: string;
    language?: string;
    roles?: CurrentUserRole[];
    phone?: string;
  };

  type CurrentUserRole = {
    id?: number;
    code?: string;
    name?: string;
    authorities?: CurrentUserRoleAuthority[];
  };

  type CurrentUserRoleAuthority = {
    id?: number;
    code?: string;
    name?: string;
  };

  type LoginResult = {
    access_token?: string;
    refresh_token?: string;
    expires_in?: bigint;
    token_type?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type AccountListItem = {
    id?: number;
    avatar?: string;
    username?: string;
    email?: string;
    creationTime?: string;
    phone?: string;
  };

  type AccountListRes = {
    data?: AccountPage;
  };

  type AccountPage = {
    content?: AccountListItem[];
    /** 列表的内容总数 */
    totalElements?: number;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
