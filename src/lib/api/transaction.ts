import api from '@/lib/api/axios'
import type { ApiResponse } from '@/types/api'
import type { Company } from './company'
import type { Sale } from './sales'
import type { User } from './user'

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
  createdById: number
  createdAt: string
  updatedAt: string

  // Relations
  company?: Company
  sale?: Sale & { passport?: { fullName: string; passportNo: string } }
  createdBy?: User
}

export type PaymentMethod = {
  id: number
  accountName: string
  accountNumber: string
  bankName: string
  balance: number
}

export type CreatePaymentMethodPayload = {
  accountName: string
  accountNumber: string
  bankName: string
  balance: number
}

export const getTransactions = async (query?: string) => {
  const { data } = await api.get<ApiResponse<Transaction[]>>('/transactions', {
    params: { query: query || '' },
  })
  return data
}

export const getTransaction = async (id: number) => {
  const { data } = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`)
  return data
}

export const createPaymentMethod = async (payload: CreatePaymentMethodPayload) => {
  const { data } = await api.post<ApiResponse<PaymentMethod>>(
    '/transactions/payment-method',
    payload,
  )
  return data
}

export const getPaymentMethods = async () => {
  const { data } = await api.get<ApiResponse<PaymentMethod[]>>('/transactions/payment-method')
  return data
}
