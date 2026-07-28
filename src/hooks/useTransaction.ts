import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPaymentMethod,
  fundTransfer,
  getPaymentMethods,
  getTransaction,
  getTransactions,
  receivePayment,
  sendPayment,
  type CreatePaymentMethodPayload,
} from '@/lib/api/transaction'
import { toaster } from 'rsuite'
import message from '@/utils/message'

export const useTransactions = ({ query }: { query?: string } = {}) => {
  return useQuery({
    queryKey: ['transactions', query],
    queryFn: () => getTransactions(query),
    staleTime: 1000 * 60 * 5,
  })
}

export const useTransaction = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const res = await getTransaction(Number(id))
      return res.data
    },
    enabled: Boolean(id) && enabled,
  })
}

export const useCreatePaymentMethod = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['payment-method'],
    mutationFn: (payload: CreatePaymentMethodPayload) => createPaymentMethod(payload),
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })
}

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => getPaymentMethods(),
    staleTime: 1000 * 60 * 5,
  })
}

export const useReceivePayment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['receive-payment'],
    mutationFn: receivePayment,
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })
}

export const useSendPayment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['send-payment'],
    mutationFn: sendPayment,
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })
}

export const useFundTransfer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['fund-transfer'],
    mutationFn: fundTransfer,
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['transactions'] })
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
    },
  })
}
