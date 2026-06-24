import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCompany,
  deleteCompany,
  getCompany,
  getCompanies,
  updateCompany,
  searchCompanies,
  getCompanyBalance,
} from '@/lib/api/company'
import type { CreateCompanyPayload, UpdateCompanyPayload } from '@/lib/api/company'
import { toaster } from 'rsuite'
import message from '@/utils/message'

export const useCompanies = ({ query }: { query?: string }) => {
  return useQuery({
    queryKey: ['companies', query],
    queryFn: () => getCompanies(query),
    staleTime: 1000 * 60 * 5,
  })
}

export const useSearchCompanies = () => {
  return useQuery({
    queryKey: ['companies', 'search'],
    queryFn: () => searchCompanies(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCompany = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['company', id],
    queryFn: async () => {
      const res = await getCompany(Number(id))
      return res.data
    },
    enabled: Boolean(id) && enabled,
  })
}

export const useCreateCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['company', 'create'],
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['company', res.data.id] })
    },
  })
}

export const useUpdateCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['company', 'update'],
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCompanyPayload }) =>
      updateCompany(id, payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['company', res.data.id] })
    },
  })
}

export const useCompanyBalance = (id: number) => {
  return useQuery({
    queryKey: ['company', id, 'balance'],
    queryFn: async () => {
      const res = await getCompanyBalance(Number(id))
      return res.data
    },
    enabled: Boolean(id),
    staleTime: 0,
  })
}

export const useDeleteCompany = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['company', 'delete'],
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
