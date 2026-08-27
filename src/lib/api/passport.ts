/**
 * Passport API layer.
 * Holds passport types and CRUD/search request helpers.
 */

import api from '@/lib/api/axios'
import type { ApiResponse } from '@/types/api'

/* =========================================
   Types
========================================= */

export type PassportStatus = 'RECEIVED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'

export type MaritalStatus = 'MARRIED' | 'UNMARRIED'

/* =========================================
   Passport Type
========================================= */

export type Passport = {
  id: number

  agentId: number

  fullName: string
  passportNo: string

  dob: string
  nid: string

  issueDate: string
  expiryDate: string

  phone: string
  whatsapp: string

  email?: string | null

  fatherName: string
  fatherNid?: string | null

  motherName: string
  motherNid?: string | null

  country: string

  maritalStatus: MaritalStatus

  spouseName?: string | null
  spouseNid?: string | null

  remarks?: string | null

  status: PassportStatus

  createdById: number

  createdAt: string
  updatedAt: string
}

/* =========================================
   Passport With Relations
========================================= */

export type PassportWithRelations = Passport & {
  agent?: {
    id: number
    name: string
  }

  createdBy?: {
    id: number
    fullName: string
    role: 'AGENT' | 'ADMIN'
  }
}

/* =========================================
   Create Payload
========================================= */

export type CreatePassportPayload = {
  agentId: number

  fullName: string
  passportNo: string

  dob: Date | string

  nid: string

  issueDate: Date | string
  expiryDate: Date | string

  phone: string
  whatsapp: string

  email?: string

  fatherName: string
  fatherNid?: string

  motherName: string
  motherNid?: string

  country: string

  maritalStatus: MaritalStatus

  spouseName?: string
  spouseNid?: string

  remarks?: string
}

/* =========================================
   Update Payload
========================================= */

export type UpdatePassportPayload = Partial<CreatePassportPayload>

/* =========================================
   Get Passport Params
========================================= */

/* =========================================
   Get Passports Params
========================================= */

export type GetPassportsParams = {
  query?: string
  agentId?: number
  page?: number
}

/* =========================================
   Pagination Meta
========================================= */

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

/* =========================================
   Paginated Passports
========================================= */

export type PaginatedPassports = {
  items: PassportWithRelations[]

  meta: PaginationMeta
}

/* =========================================
   Search Passport Item
========================================= */

export type PassportSearchItem = {
  id: number
  agentId: number
  fullName: string
  passportNo: string
  status: PassportStatus

  agent?: {
    id: number
    name: string
  }
}

export type SearchPassportsParams = {
  query?: string
  agentId?: number
}

/* =========================================
   Update Status Payload
========================================= */

export type UpdatePassportStatusPayload = {
  status: PassportStatus
}

/* =========================================
   Get Passports
========================================= */

/* =========================================
   Get Passports
========================================= */

export const getPassports = async (params: GetPassportsParams = {}) => {
  const { data } = await api.get<ApiResponse<PassportWithRelations[]>>('/passports', {
    params,
  })

  return data
}
/* =========================================
   Search Passports
========================================= */

/* =========================================
   Search Passports
========================================= */

export const searchPassports = async (params: SearchPassportsParams = {}) => {
  const { data } = await api.get<ApiResponse<PassportSearchItem[]>>('/passports/search', {
    params: {
      query: params.query || undefined,

      agentId: params.agentId || undefined,
    },
  })

  return data
}

/* =========================================
   Get Single Passport
========================================= */

export const getPassport = async (id: number) => {
  const { data } = await api.get<ApiResponse<PassportWithRelations>>(`/passports/${id}`)

  return data
}

/* =========================================
   Create Passport
========================================= */

export const createPassport = async (payload: CreatePassportPayload) => {
  const { data } = await api.post<ApiResponse<Passport>>('/passports', payload)

  return data
}

/* =========================================
   Update Passport
========================================= */

export const updatePassport = async (id: number, payload: UpdatePassportPayload) => {
  const { data } = await api.patch<ApiResponse<Passport>>(`/passports/${id}`, payload)

  return data
}

/* =========================================
   Update Passport Status
========================================= */

export const updatePassportStatus = async (id: number, payload: UpdatePassportStatusPayload) => {
  const { data } = await api.patch<ApiResponse<Passport>>(`/passports/${id}/status`, payload)

  return data
}

/* =========================================
   Delete Passport
========================================= */

export const deletePassport = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/passports/${id}`)

  return data
}
