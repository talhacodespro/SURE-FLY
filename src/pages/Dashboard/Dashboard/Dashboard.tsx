import { Divider, Heading, Progress, Stat, StatGroup } from 'rsuite'

import { useDashboardReport } from '@/hooks/useReport'

/* =========================================
   Dashboard Page
========================================= */

const Page = () => {
  /* =========================================
     Dashboard Report
  ========================================= */

  const {
    data: reportRes,

    isLoading,
    isFetching,
  } = useDashboardReport()

  const report = reportRes?.data

  const totalAgents = report?.totalAgents ?? 0

  const totalPassports = report?.totalPassports ?? 0

  const loading = isLoading || isFetching

  return (
    <div>
      {/* =====================================
          Header
      ===================================== */}
      <Heading level={3}>Dashboard</Heading>

      <Divider />
      {/* =====================================
          Statistics
      ===================================== */}
      <div className="mb-6">
        <StatGroup spacing={20} columns={2}>
          {/* Total Agents */}

          <Stat bordered>
            <Stat.Label>Total Agents</Stat.Label>

            <Stat.Value>{loading ? '-' : totalAgents}</Stat.Value>

            <Progress.Line percent={totalAgents > 0 ? 100 : 0} showInfo={false} />
          </Stat>

          {/* Total Passports */}

          <Stat bordered>
            <Stat.Label>Total Passports</Stat.Label>

            <Stat.Value>{loading ? '-' : totalPassports}</Stat.Value>

            <Progress.Line percent={totalPassports > 0 ? 100 : 0} showInfo={false} />
          </Stat>
        </StatGroup>
      </div>
    </div>
  )
}

export default Page
