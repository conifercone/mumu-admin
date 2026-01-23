import type { PageResult } from '@/types/api';
import http, { ServicePrefix } from '@/utils/http';

export interface Permission {
  id: number;
  code: string;
  name: string;
  description: string;
  parentId?: number;
  children?: Permission[];
  hasDescendant?: boolean;
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

/**
 * Find all root permissions
 */
export function findRootPermissions() {
  return http.get<Permission[]>(`${ServicePrefix.IAM}/permission/findRoot`);
}

/**
 * Find direct child permissions by parent ID (paginated)
 */
export function findDirectPermissions(params: {
  ancestorId: number;
  current: number;
  pageSize: number;
}) {
  return http.get<PageResult<Permission>>(
    `${ServicePrefix.IAM}/permission/findDirect`,
    {
      params,
    },
  );
}

/**
 * Delete a permission relationship path
 */
export function deletePermissionPath(ancestorId: number, descendantId: number) {
  return http.delete(
    `${ServicePrefix.IAM}/permission/deletePath/${ancestorId}/${descendantId}`,
  );
}

/**
 * Add a permission descendant relationship
 */
export function addPermissionDescendant(data: {
  ancestorId: number;
  descendantId: number;
}) {
  return http.put(`${ServicePrefix.IAM}/permission/addDescendant`, data);
}

/**
 * Find all ancestor path strings for a descendant
 */
export function findAllAncestorPathStrings(descendantId: number) {
  return http.get<string[]>(
    `${ServicePrefix.IAM}/permission/findAllAncestorPathStrings/${descendantId}`,
  );
}
