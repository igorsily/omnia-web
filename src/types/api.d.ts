export type ApiResponse<T> = {
  data?: T;
  message?: string;
  error?: string;
  details?: unknown[];
};

export type ApiPaginatedResponse<T> = ApiResponse<T[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type FetchParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
