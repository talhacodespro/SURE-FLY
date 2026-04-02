export type ApiError = {
  message: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}
