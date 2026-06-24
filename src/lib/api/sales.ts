import api from '@/lib/api/axios'
import type { ApiResponse } from '@/types/api'

export type Sale = {
  id: number
  type: 'TICKET' | 'VISA'
  purchaseAmount: number
  companyAmount: number
  remarks?: string
  passportId: number
  companyId: number
  purchaseFromId: number
  ticketId?: number
  visaId?: number
  createdAt?: string
  updatedAt?: string
}

export type CreateSalePayload = {
  type: 'TICKET' | 'VISA'
  purchaseAmount: number
  companyAmount: number
  remarks?: string
  passportId: number
  companyId: number
  purchaseFromId: number
  ticket?: {
    ticketNo: string
    issueDate: Date | string
    sector: string
    pnr: string
    air: string
    flightDate: Date | string
  }
  visa?: {
    country: string
    visaType: string
  }
}

export type UpdateSalePayload = Partial<CreateSalePayload>

export const getSales = async (query?: string) => {
  const { data } = await api.get<ApiResponse<Sale[]>>('/sales', {
    params: { query: query || '' },
  })
  return data
}

export const getSale = async (id: number) => {
  const { data } = await api.get<ApiResponse<Sale>>(`/sales/${id}`)
  return data
}

export const createSale = async (payload: CreateSalePayload) => {
  const { data } = await api.post<ApiResponse<Sale>>('/sales', payload)
  return data
}

export const updateSale = async (id: number, payload: UpdateSalePayload) => {
  const { data } = await api.patch<ApiResponse<Sale>>(`/sales/${id}`, payload)
  return data
}

export const deleteSale = async (id: number | string) => {
  const { data } = await api.delete<ApiResponse<{ success: boolean }>>(`/sales/${id}`)
  return data
}
