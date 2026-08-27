import type { ApiResponse } from '@/types/api'
import api from './axios'

/* =========================================
   Types
========================================= */

export type UserRole = 'AGENT' | 'ADMIN'

export type User = {
  id: number

  fullName: string
  email: string

  phone: string | null

  role: UserRole

  isActive: boolean

  createdAt: string
  updatedAt: string
}

/* =========================================
   Create User
========================================= */

export type CreateUserPayload = {
  fullName: string
  email: string
  phone: string
  password: string

  role: UserRole
}

/* =========================================
   Update Profile
========================================= */

export type UpdateProfilePayload = {
  fullName?: string
  email?: string
  phone?: string

  password?: string
}

/* =========================================
   Update User
========================================= */

export type UpdateUserPayload = {
  fullName?: string
  email?: string
  phone?: string

  password?: string

  role?: UserRole

  isActive?: boolean
}

/* =========================================
   Create User
========================================= */

export const createUser = async (payload: CreateUserPayload) => {
  const { data } = await api.post<ApiResponse<User>>('/users', payload)

  return data
}

/* =========================================
   Get Users
========================================= */

export const getUsers = async () => {
  const { data } = await api.get<ApiResponse<User[]>>('/users')

  return data
}

/* =========================================
   Get User
========================================= */

export const getUser = async (id: number) => {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`)

  return data
}

/* =========================================
   Update Profile
========================================= */

export const updateProfile = async (payload: UpdateProfilePayload) => {
  const { data } = await api.patch<ApiResponse<User>>('/users/me', payload)

  return data
}

/* =========================================
   Update User
========================================= */

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  const { data } = await api.patch<ApiResponse<User>>(`/users/${id}`, payload)

  return data
}
