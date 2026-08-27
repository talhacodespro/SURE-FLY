import type { ApiResponse } from '@/types/api'
import api from './axios'

/* =========================================
   Dashboard Report
========================================= */

export type DashboardReport = {
  totalAgents: number

  totalPassports: number
}

/* =========================================
   Get Dashboard Report
========================================= */

export const getDashboardReport = async () => {
  const { data } = await api.get<ApiResponse<DashboardReport>>('/reports/dashboard')

  return data
}
