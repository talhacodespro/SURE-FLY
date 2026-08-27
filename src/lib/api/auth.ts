import type { ApiResponse } from '@/types/api'
import api from './axios'

/* =========================================
   Types
========================================= */

export type UserRole = 'AGENT' | 'ADMIN'

export type AuthUser = {
  id: number
  fullName: string
  email: string
  phone?: string | null

  role: UserRole

  isActive: boolean

  createdAt: string
  updatedAt: string

  isImpersonating?: boolean

  impersonatedBy?: {
    id: number
    fullName: string
    email: string
    role: 'ADMIN'
  } | null
}

/* =========================================
   Impersonation
========================================= */

export type ImpersonateResult = {
  token: string

  user: {
    id: number
    fullName: string
    email: string
    phone?: string | null
    role: 'AGENT'
    isActive: boolean
  }

  impersonatedBy: {
    id: number
    fullName: string
    email: string
  }
}

/* =========================================
   Login Types
========================================= */

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResult = {
  token: string
}

/* =========================================
   Login
========================================= */

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse<LoginResult>>('/auth/login', payload)

  return data
}

/* =========================================
   Me
========================================= */

export const getMe = async () => {
  const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me')

  return data
}

/* =========================================
   Impersonate Agent
========================================= */

export const impersonateAgent = async (userId: number) => {
  const { data } = await api.post<ApiResponse<ImpersonateResult>>(`/auth/impersonate/${userId}`)

  return data
}
