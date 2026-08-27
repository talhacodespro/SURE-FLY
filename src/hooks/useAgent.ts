/**
 * Agent React Query hooks.
 * Keeps agent API calls and cache updates in one place.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toaster } from 'rsuite'

import {
  createAgent,
  deleteAgent,
  getAgent,
  getAgents,
  searchAgents,
  updateAgent,
} from '@/lib/api/agent'

import type { CreateAgentPayload, GetAgentsParams, UpdateAgentPayload } from '@/lib/api/agent'

import message from '@/utils/message'

/* =========================================
   Get Agents
========================================= */

/* =========================================
   Query Keys
========================================= */

export const agentKeys = {
  all: ['agents'] as const,

  list: (params: GetAgentsParams = {}) => ['agents', 'list', params] as const,

  search: (query?: string) => ['agents', 'search', query ?? ''] as const,

  detail: (id: number) => ['agent', id] as const,
}

/* =========================================
   Get Agents
========================================= */

export const useAgents = (params: GetAgentsParams = {}) => {
  return useQuery({
    queryKey: agentKeys.list(params),

    queryFn: () => getAgents(params),

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) => previousData,
  })
}

/* =========================================
   Search Agents
========================================= */

export const useSearchAgents = (query?: string) => {
  return useQuery({
    queryKey: agentKeys.search(query),

    queryFn: () => searchAgents(query),

    staleTime: 1000 * 60 * 5,
  })
}

/* =========================================
   Get Single Agent
========================================= */

export const useAgent = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['agent', id],

    queryFn: async () => {
      const res = await getAgent(Number(id))

      return res.data
    },

    enabled: Boolean(id) && enabled,

    staleTime: 1000 * 60 * 5,
  })
}

/* =========================================
   Create Agent
========================================= */

export const useCreateAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['agent', 'create'],

    mutationFn: (payload: CreateAgentPayload) => createAgent(payload),

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
        queryKey: ['agents'],
      })

      if (res.data?.id) {
        queryClient.invalidateQueries({
          queryKey: ['agent', res.data.id],
        })
      }
    },
  })
}

/* =========================================
   Update Agent
========================================= */

export const useUpdateAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['agent', 'update'],

    mutationFn: ({ id, payload }: { id: number; payload: UpdateAgentPayload }) =>
      updateAgent(id, payload),

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
        queryKey: ['agents'],
      })

      if (res.data?.id) {
        queryClient.invalidateQueries({
          queryKey: ['agent', res.data.id],
        })
      }
    },
  })
}

/* =========================================
   Delete Agent
========================================= */

export const useDeleteAgent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['agent', 'delete'],

    mutationFn: (id: number) => deleteAgent(id),

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

      queryClient.invalidateQueries({
        queryKey: agentKeys.all,
      })

      queryClient.removeQueries({
        queryKey: agentKeys.detail(deletedId),
      })
    },
  })
}
