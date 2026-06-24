import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSale, deleteSale, getSale, getSales, updateSale } from '@/lib/api/sales'
import type { CreateSalePayload, UpdateSalePayload } from '@/lib/api/sales'
import { toaster } from 'rsuite'
import message from '@/utils/message'
import { useNavigate } from 'react-router'

export const useSales = ({ query }: { query?: string }) => {
  return useQuery({
    queryKey: ['sales', query],
    queryFn: () => getSales(query),
    staleTime: 1000 * 60 * 5,
  })
}

export const useSale = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      const res = await getSale(Number(id))
      return res.data
    },
    enabled: Boolean(id) && enabled,
  })
}

export const useCreateSale = () => {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['sale', 'create'],
    mutationFn: (payload: CreateSalePayload) => createSale(payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['sales'] })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      navigate('/list-sales')
    },
  })
}

export const useUpdateSale = () => {
  const qc = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['sale', 'update'],
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSalePayload }) =>
      updateSale(id, payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['sales'] })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['sale', res.data.id] })
      navigate('/list-sales')
    },
  })
}

export const useDeleteSale = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['sale', 'delete'],
    mutationFn: (id: number) => deleteSale(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sales'] })
      qc.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
