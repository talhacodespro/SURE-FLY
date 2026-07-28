import type { ApiResponse } from '@/types/api'
import api from './axios'

export type ExpenseCategory = {
  id: number
  name: string
  remarks: string
  createdAt?: string
  updatedAt?: string
}

export type CreateExpensePayload = {
  amount: number
  categoryId: number
  paymentMethodId: number
  remarks?: string
}

export type Expense = {
  id: number
  amount: number
  categoryId: number
  paymentMethodId: number
  remarks?: string
  createdAt?: string
  updatedAt?: string
  category?: ExpenseCategory
  paymentMethod?: { accountName: string; accountNumber: string; bankName: string }
}

export const getExpenseCategories = async (fields?: string[]) => {
  const { data } = await api.get<ApiResponse<ExpenseCategory[]>>('/expenses/categories', {
    params: { fields: fields?.join(',') },
  })
  return data
}

export const createExpenseCategory = async (payload: Pick<ExpenseCategory, 'name' | 'remarks'>) => {
  const { data } = await api.post<ApiResponse<ExpenseCategory>>('/expenses/categories', payload)
  return data
}

export const createExpense = async (payload: CreateExpensePayload) => {
  const { data } = await api.post<ApiResponse<Expense>>('/expenses', payload)
  return data
}

export const getExpenses = async () => {
  const { data } = await api.get<ApiResponse<Expense[]>>('/expenses')
  return data
}
