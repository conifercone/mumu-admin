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

/**
 * Create a new permission
 */
export function createPermission(data: Partial<Permission>) {
  return http.post(`${ServicePrefix.IAM}/permission/add`, data);
}

/**
 * Update a permission by ID
 */
export function updatePermission(data: Partial<Permission>) {
  return http.put(`${ServicePrefix.IAM}/permission/updateById`, data);
}

/**
 * Delete a permission by ID
 */
export function deletePermission(id: number) {
  return http.delete(`${ServicePrefix.IAM}/permission/deleteById/${id}`);
}

/**
 * Download all permissions as a file
 */
export function downloadAllPermissions() {
  return http.get(`${ServicePrefix.IAM}/permission/downloadAll`, {
    responseType: 'blob',
  });
}
