import type { ApiResponse } from '@/types/api'
import api from './axios'

export type ExpenseCategory = {
  id: number
  name: string
  remarks: string
  createdAt?: string
  updatedAt?: string
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
