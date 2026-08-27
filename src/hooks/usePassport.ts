/**
 * Passport React Query hooks.
 * Handles passport CRUD, search, status update
 * and cache refresh logic.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toaster } from 'rsuite'

import {
  createPassport,
  deletePassport,
  getPassport,
  getPassports,
  searchPassports,
  updatePassport,
  updatePassportStatus,
} from '@/lib/api/passport'

import type {
  CreatePassportPayload,
  GetPassportsParams,
  SearchPassportsParams,
  UpdatePassportPayload,
  UpdatePassportStatusPayload,
} from '@/lib/api/passport'

import message from '@/utils/message'

/* =========================================
   Query Keys
========================================= */

export const passportKeys = {
  all: ['passports'] as const,

  list: (params: GetPassportsParams = {}) => ['passports', 'list', params] as const,

  search: (agentId?: number, query?: string) =>
    ['passports', 'search', agentId ?? 0, query ?? ''] as const,

  detail: (id: number) => ['passport', id] as const,
}

/* =========================================
   Get Passports
========================================= */

export const usePassports = (params: GetPassportsParams = {}, enabled = true) => {
  return useQuery({
    queryKey: passportKeys.list(params),

    queryFn: () => getPassports(params),

    enabled,

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) => previousData,
  })
}

/* =========================================
   Search Passports
========================================= */

export const useSearchPassports = (params: SearchPassportsParams = {}, enabled = true) => {
  return useQuery({
    queryKey: passportKeys.search(params.agentId, params.query),

    queryFn: () => searchPassports(params),

    enabled,

    staleTime: 1000 * 60 * 5,
  })
}

/* =========================================
   Get Single Passport
========================================= */

export const usePassport = (id: number, enabled = true) => {
  return useQuery({
    queryKey: passportKeys.detail(id),

    queryFn: async () => {
      const res = await getPassport(id)

      return res.data
    },

    enabled: Boolean(id) && enabled,

    staleTime: 1000 * 60 * 5,
  })
}

/* =========================================
   Create Passport
========================================= */

export const useCreatePassport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['passport', 'create'],

    mutationFn: (payload: CreatePassportPayload) => createPassport(payload),

    onSuccess: (res) => {
      toaster.push(
        message({
          message: res.message,
          type: 'success',
        }),
        {
          placement: 'bottomEnd',
        },
      )

      queryClient.invalidateQueries({
        queryKey: passportKeys.all,
      })

      if (res.data?.id) {
        queryClient.invalidateQueries({
          queryKey: passportKeys.detail(res.data.id),
        })
      }
    },
  })
}

/* =========================================
   Update Passport
========================================= */

export const useUpdatePassport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['passport', 'update'],

    mutationFn: ({ id, payload }: { id: number; payload: UpdatePassportPayload }) =>
      updatePassport(id, payload),

    onSuccess: (res) => {
      toaster.push(
        message({
          message: res.message,
          type: 'success',
        }),
        {
          placement: 'bottomEnd',
        },
      )

      queryClient.invalidateQueries({
        queryKey: passportKeys.all,
      })

      if (res.data?.id) {
        queryClient.invalidateQueries({
          queryKey: passportKeys.detail(res.data.id),
        })
      }
    },
  })
}

/* =========================================
   Update Passport Status
========================================= */

export const useUpdatePassportStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['passport', 'status'],

    mutationFn: ({ id, payload }: { id: number; payload: UpdatePassportStatusPayload }) =>
      updatePassportStatus(id, payload),

    onSuccess: (res) => {
      toaster.push(
        message({
          message: res.message,
          type: 'success',
        }),
        {
          placement: 'bottomEnd',
        },
      )

      /*
       * Refresh list, search and stats.
       */
      queryClient.invalidateQueries({
        queryKey: passportKeys.all,
      })

      if (res.data?.id) {
        queryClient.invalidateQueries({
          queryKey: passportKeys.detail(res.data.id),
        })
      }
    },
  })
}

/* =========================================
   Delete Passport
========================================= */

export const useDeletePassport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['passport', 'delete'],

    mutationFn: (id: number) => deletePassport(id),

    onSuccess: (res, deletedId) => {
      toaster.push(
        message({
          message: res.message,
          type: 'success',
        }),
        {
          placement: 'bottomEnd',
        },
      )

      /*
       * Refresh every passport list/search.
       */
      queryClient.invalidateQueries({
        queryKey: passportKeys.all,
      })

      /*
       * Remove deleted passport detail cache.
       */
      queryClient.removeQueries({
        queryKey: passportKeys.detail(deletedId),
      })
    },
  })
}
