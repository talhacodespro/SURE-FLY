import { useQuery } from '@tanstack/react-query'

import { getDashboardReport } from '@/lib/api/report'

/* =========================================
   Report Keys
========================================= */

export const reportKeys = {
  all: ['reports'] as const,

  dashboard: ['reports', 'dashboard'] as const,
}

/* =========================================
   Dashboard Report
========================================= */

export const useDashboardReport = () => {
  return useQuery({
    queryKey: reportKeys.dashboard,

    queryFn: getDashboardReport,

    staleTime: 1000 * 60 * 5,
  })
}
