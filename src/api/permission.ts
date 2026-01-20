import type { PageResult } from '@/types/api';
import http, { ServicePrefix } from '@/utils/http';

export interface Permission {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface PermissionQueryParams {
  code?: string;
  name?: string;
  description?: string;
  current?: number;
  pageSize?: number;
}

/**
 * Find all permissions (paginated)
 */
export function getPermissions(params: PermissionQueryParams) {
  return http.get<PageResult<Permission>>(
    `${ServicePrefix.IAM}/permission/findAll`,
    {
      params,
    },
  );
}
