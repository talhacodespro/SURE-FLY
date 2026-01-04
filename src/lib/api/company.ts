import api from '@/lib/api/axios'
import type { AxiosResponse } from 'axios'

export type Company = {
  id: number
  name: string
  mobile: string
  contactPersonName: string
  contactPersonMobile: string
  email: string
  address: string
  remarks: string
  createdAt?: string
  updatedAt?: string
}

export type CreateCompanyPayload = {
  name: string
  mobile: string
  contactPersonName: string
  contactPersonMobile: string
  email: string
  address: string
  remarks: string
  type?: string
}

export type UpdateCompanyPayload = Partial<CreateCompanyPayload>

export const getCompanies = async (): Promise<Company[]> => {
  const res: AxiosResponse<Company[]> = await api.get('/companies')
  return res.data
}

export const getCompany = async (id: number | string): Promise<Company> => {
  const res: AxiosResponse<Company> = await api.get(`/companies/${id}`)
  return res.data
}

export const createCompany = async (payload: CreateCompanyPayload): Promise<Company> => {
  const res: AxiosResponse<Company> = await api.post('/companies', payload)
  return res.data
}

export const updateCompany = async (
  id: number | string,
  payload: UpdateCompanyPayload,
): Promise<Company> => {
  const res: AxiosResponse<Company> = await api.put(`/companies/${id}`, payload)
  return res.data
}

export const deleteCompany = async (id: number | string): Promise<{ success: boolean }> => {
  const res: AxiosResponse<{ success: boolean }> = await api.delete(`/companies/${id}`)
  return res.data
}
