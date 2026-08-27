/**
 * Shared API response types.
 * Keeps success and error payload shapes consistent across the app.
 */
export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}

export type TMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
  meta?: TMeta
}
