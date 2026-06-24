import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPassport,
  deletePassport,
  getPassport,
  getPassports,
  updatePassport,
  searchPassports,
} from '@/lib/api/passport'
import type { CreatePassportPayload, UpdatePassportPayload } from '@/lib/api/passport'
import { toaster } from 'rsuite'
import message from '@/utils/message'

export const usePassports = ({ query }: { query?: string }) => {
  return useQuery({
    queryKey: ['passports', query],
    queryFn: () => getPassports(query),
    staleTime: 1000 * 60 * 5,
  })
}

export const useSearchPassports = () => {
  return useQuery({
    queryKey: ['passports', 'search'],
    queryFn: () => searchPassports(),
    staleTime: 1000 * 60 * 5,
  })
}

export const usePassport = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['passport', id],
    queryFn: async () => {
      const res = await getPassport(Number(id))
      return res.data
    },
    enabled: Boolean(id) && enabled,
  })
}

export const useCreatePassport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['passport', 'create'],
    mutationFn: (payload: CreatePassportPayload) => createPassport(payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['passports'] })
    },
  })
}

export const useUpdatePassport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['passport', 'update'],
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePassportPayload }) =>
      updatePassport(id, payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['passports'] })
      qc.invalidateQueries({ queryKey: ['passport', res.data.id] })
    },
  })
}

export const useDeletePassport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['passport', 'delete'],
    mutationFn: (id: number) => deletePassport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['passports'] })
    },
  })
}
