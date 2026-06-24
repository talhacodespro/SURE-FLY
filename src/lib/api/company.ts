import api from '@/lib/api/axios'
import type { ApiResponse } from '@/types/api'

export type Company = {
  id: number
  name: string
  phone: string
  contactName: string
  contactPhone: string
  email: string
  address: string
  remarks: string
  createdAt?: string
  updatedAt?: string
}

export type TransactionType =
  | 'INVOICE'
  | 'PAYMENT'
  | 'EXPENSE'
  | 'REFUND'
  | 'TRANSFER'
  | 'ADJUSTMENT'
export type TransactionDirection = 'CREDIT' | 'DEBIT'

export type Transaction = {
  id: number
  type: TransactionType
  direction: TransactionDirection
  amount: number
  saleId?: number
  companyId?: number
  createdAt: string
  updatedAt: string
}

export type CreateCompanyPayload = {
  name: string
  phone: string
  contactName: string
  contactPhone: string
  email: string
  address: string
  remarks: string
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>

export const getCompanies = async (query?: string) => {
  const { data } = await api.get<ApiResponse<Company[]>>('/companies', {
    params: { query: query || '' },
  })
  return data
}

export const searchCompanies = async () => {
  const { data } = await api.get<ApiResponse<Pick<Company, 'id' | 'name'>[]>>('/companies/search')
  return data
}

export const getCompany = async (id: number) => {
  const { data } = await api.get<ApiResponse<Company>>(`/companies/${id}`)
  return data
}

export const getCompanyTransactions = async (id: number) => {
  const { data } = await api.get<ApiResponse<Transaction[]>>(`/companies/${id}/transactions`)
  return data
}

export const createCompany = async (payload: CreateCompanyPayload) => {
  const { data } = await api.post<ApiResponse<Pick<Company, 'id' | 'name' | 'email'>>>(
    '/companies',
    payload,
  )
  return data
}

export const updateCompany = async (id: number, payload: UpdateCompanyPayload) => {
  const { data } = await api.patch<ApiResponse<Pick<Company, 'id' | 'name' | 'email'>>>(
    `/companies/${id}`,
    payload,
  )
  return data
}

export const getCompanyBalance = async (id: number) => {
  const { data } = await api.get<ApiResponse<{ credit: number; debit: number; balance: number }>>(
    `/companies/balance/${id}`,
  )
  return data
}

export const deleteCompany = async (id: number | string) => {
  const { data } = await api.delete<ApiResponse<{ success: boolean }>>(`/companies/${id}`)
  return data
}
