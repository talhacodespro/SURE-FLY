import api from '@/lib/api/axios'
import type { ApiResponse } from '@/types/api'

export type Passport = {
  id: number
  fullName: string
  phone?: string
  email?: string
  passportNo: string
  dob: string
  expiryDate: string
  isActive: boolean
  remarks?: string
  createdAt?: string
  updatedAt?: string
}

export type CreatePassportPayload = {
  fullName: string
  phone: string
  email: string
  passportNo: string
  dob: Date | string | null
  expiryDate: Date | string | null
  remarks?: string
}

export type UpdatePassportPayload = Partial<CreatePassportPayload>

export const getPassports = async (query?: string) => {
  const { data } = await api.get<ApiResponse<Passport[]>>('/passports', {
    params: { query: query || '' },
  })
  return data
}

export const searchPassports = async () => {
  const { data } =
    await api.get<ApiResponse<Pick<Passport, 'id' | 'fullName' | 'passportNo'>[]>>(
      '/passports/search',
    )
  return data
}

export const getPassport = async (id: number) => {
  const { data } = await api.get<ApiResponse<Passport>>(`/passports/${id}`)
  return data
}

export const createPassport = async (payload: CreatePassportPayload) => {
  const { data } = await api.post<ApiResponse<Passport>>('/passports', payload)
  return data
}

export const updatePassport = async (id: number, payload: UpdatePassportPayload) => {
  const { data } = await api.patch<ApiResponse<Passport>>(`/passports/${id}`, payload)
  return data
}

export const deletePassport = async (id: number | string) => {
  const { data } = await api.delete<ApiResponse<{ success: boolean }>>(`/passports/${id}`)
  return data
}
