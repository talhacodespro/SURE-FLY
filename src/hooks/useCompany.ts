import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCompany,
  deleteCompany,
  getCompany,
  getCompanies,
  updateCompany,
} from '@/lib/api/company'
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from '@/lib/api/company'

export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: ['companies'],
    queryFn: getCompanies,
  })
}

export const useCompany = (id: number | string, enabled = true) => {
  return useQuery<Company, Error>({
    queryKey: ['company', id],
    queryFn: () => getCompany(id),
    enabled: Boolean(id) && enabled,
  })
}

export const useCreateCompany = () => {
  const qc = useQueryClient()
  return useMutation<Company, Error, CreateCompanyPayload>({
    mutationKey: ['company', 'create'],
    mutationFn: (payload) => createCompany(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

export const useUpdateCompany = () => {
  const qc = useQueryClient()
  return useMutation<Company, Error, { id: number | string; payload: UpdateCompanyPayload }>({
    mutationKey: ['company', 'update'],
    mutationFn: ({ id, payload }) => updateCompany(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      qc.invalidateQueries({ queryKey: ['company', data.id] })
    },
  })
}

export const useDeleteCompany = () => {
  const qc = useQueryClient()
  return useMutation<{ success: boolean }, Error, number | string>({
    mutationKey: ['company', 'delete'],
    mutationFn: (id) => deleteCompany(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
