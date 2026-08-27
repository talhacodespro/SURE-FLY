/**
 * Agent API layer.
 * Holds agent-related types and request helpers.
 */

import api from '@/lib/api/axios'

import type { ApiResponse } from '@/types/api'

/* =========================================
   Agent
========================================= */

export type Agent = {
  id: number

  name: string
  phone: string
  whatsapp: string

  email?: string | null
  address?: string | null
  remarks?: string | null

  isActive: boolean

  createdById: number

  createdAt: string
  updatedAt: string
}

/* =========================================
   Get Params
========================================= */

export type GetAgentsParams = {
  query?: string
  page?: number
}

/* =========================================
   Search Item
========================================= */

export type AgentSearchItem = {
  id: number
  name: string
  phone: string
}

export type CreateAgentPayload = {
  name: string
  phone: string
  whatsapp: string
  email?: string
  address?: string
  remarks?: string
}

export type UpdateAgentPayload = Partial<CreateAgentPayload>

/* =========================================
   Get Agents
========================================= */

export const getAgents = async (params: GetAgentsParams = {}) => {
  const { data } = await api.get<ApiResponse<Agent[]>>('/agents', {
    params: {
      query: params.query || undefined,

      page: params.page || 1,
    },
  })

  return data
}

/* =========================================
   Search Agents
========================================= */

export const searchAgents = async (query?: string) => {
  const { data } = await api.get<ApiResponse<AgentSearchItem[]>>('/agents/search', {
    params: {
      query: query || undefined,
    },
  })

  return data
}

/* =========================================
   Get Agent
========================================= */

export const getAgent = async (id: number) => {
  const { data } = await api.get<ApiResponse<Agent>>(`/agents/${id}`)

  return data
}

/* =========================================
   Create Agent
========================================= */

export const createAgent = async (payload: CreateAgentPayload) => {
  const { data } = await api.post<ApiResponse<Agent>>('/agents', payload)

  return data
}

/* =========================================
   Update Agent
========================================= */

export const updateAgent = async (id: number, payload: UpdateAgentPayload) => {
  const { data } = await api.patch<ApiResponse<Agent>>(`/agents/${id}`, payload)

  return data
}

/* =========================================
   Delete Agent
========================================= */

export const deleteAgent = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/agents/${id}`)

  return data
}
