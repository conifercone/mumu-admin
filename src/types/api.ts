/**
 * Generic API Response Types
 */

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  offset: number | string;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: SortObject;
  unpaged: boolean;
}

export interface PageResult<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number; // 0-based page index
  numberOfElements: number;
  pageable: PageableObject;
  size: number;
  sort: SortObject;
  totalElements: string | number; // Backend might return string for large numbers
  totalPages: number;
}
