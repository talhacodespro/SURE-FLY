import api from '@/lib/api/axios'
import type { ApiResponse } from '@/types/api'
import type { AxiosResponse } from 'axios'

export type User = {
  id: number
  name: string
  email: string
  mobile?: string
  role?: string
  status?: string
  dob?: string | Date | null
  address?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateUserPayload = {
  fullName: string
  email: string
  phone?: string
  password?: string
  avatar?: string
  role?: string
  status?: string
  dob?: string | Date | null
  address?: string
}

export type UpdateUserPayload = Partial<CreateUserPayload>

export type LoginPayload = {
  email: string
  password: string
}

export type LoginData = {
  token: string
}

export type AuthResponse = ApiResponse<LoginData>

export type MeData = {
  id: number
  fullName: string
  email: string
  phone: string | null
  avatar: string | null
  isPasswordSet: boolean
  dob: string | null
  address: string | null
  isActive: boolean
  role: string
  createdAt: string
  updatedAt: string
}

export const getUsers = async (): Promise<User[]> => {
  const res: AxiosResponse<User[]> = await api.get('/users')
  return res.data
}

export const getUser = async (id: number | string): Promise<User> => {
  const res: AxiosResponse<User> = await api.get(`/users/${id}`)
  return res.data
}

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res: AxiosResponse<User> = await api.post('/users', payload)
  return res.data
}

export const updateUser = async (
  id: number | string,
  payload: UpdateUserPayload,
): Promise<User> => {
  const res: AxiosResponse<User> = await api.patch(`/users/${id}`, payload)
  return res.data
}

export const deleteUser = async (id: number | string): Promise<{ success: boolean }> => {
  const res: AxiosResponse<{ success: boolean }> = await api.delete(`/users/${id}`)
  return res.data
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res: AxiosResponse<AuthResponse> = await api.post('/auth/login', payload)
  return res.data
}

export const me = async (): Promise<ApiResponse<MeData>> => {
  const res: AxiosResponse<ApiResponse<MeData>> = await api.get('/auth/me')
  return res.data
}
