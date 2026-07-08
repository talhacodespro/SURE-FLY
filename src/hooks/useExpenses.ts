import { createExpenseCategory, getExpenseCategories } from '@/lib/api/expenses'
import message from '@/utils/message'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toaster } from 'rsuite'

export const useExpenseCategories = (fields?: string[]) => {
  return useQuery({
    queryKey: ['expenseCategories'],
    queryFn: () => getExpenseCategories(fields),
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateExpenseCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationKey: ['createExpenseCategory'],
    mutationFn: createExpenseCategory,
    onSuccess: (res) => {
      toaster.push(message({ message: res.message, type: 'success' }), { placement: 'bottomEnd' })
      qc.invalidateQueries({ queryKey: ['expenseCategories'] })
    },
  })
}
