import { Table, Divider, Tag } from 'rsuite'
import { useTransactions } from '@/hooks/useTransaction'
import moment from 'moment'

const { Column, HeaderCell, Cell } = Table

// ========== Type Color Mapping ==========
const typeColorMap: Record<string, string> = {
  INVOICE: 'blue',
  PAYMENT: 'green',
  EXPENSE: 'red',
  REFUND: 'orange',
  ADJUSTMENT: 'violet',
}

// ========== Direction Color Mapping ==========
const directionColorMap: Record<string, string> = {
  DEBIT: 'red',
  CREDIT: 'green',
}

// ========== List Transactions Page Component ==========
const Page = () => {
  // ========== Hook for Fetching Transactions ==========
  const { data: transactionsRes, isLoading, isFetching } = useTransactions()
  const transactionsData = transactionsRes?.data || []
  console.log(transactionsRes)
  return (
    <div className="p-2">
      <Divider>List Transactions</Divider>

      {/* ========== Transactions Table ========== */}
      <Table
        autoHeight
        bordered
        cellBordered
        data={transactionsData}
        loading={isLoading || isFetching}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={200}>
          <HeaderCell>Date</HeaderCell>
          <Cell>{(rowData) => moment(rowData.createdAt).format('YYYY-MM-DD hh:mm A')}</Cell>
        </Column>

        <Column width={130}>
          <HeaderCell>Type</HeaderCell>
          <Cell>
            {(rowData) => <Tag color={typeColorMap[rowData.type] || 'default'}>{rowData.type}</Tag>}
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Direction</HeaderCell>
          <Cell>
            {(rowData) => (
              <Tag color={directionColorMap[rowData.direction] || 'default'}>
                {rowData.direction}
              </Tag>
            )}
          </Cell>
        </Column>

        <Column width={140}>
          <HeaderCell>Amount</HeaderCell>
          <Cell className="font-medium">
            {(rowData) => Number(rowData.amount || 0).toLocaleString()}
          </Cell>
        </Column>

        {/* <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Company</HeaderCell>
          <Cell>{(rowData) => rowData.company?.name || 'N/A'}</Cell>
        </Column> */}

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Payment Method</HeaderCell>
          <Cell>
            {(rowData) =>
              rowData.paymentMethod
                ? `${rowData.paymentMethod.accountName} (${rowData.paymentMethod.bankName})`
                : 'N/A'
            }
          </Cell>
        </Column>

        <Column width={160}>
          <HeaderCell>Created By</HeaderCell>
          <Cell>{(rowData) => rowData.createdBy?.fullName || 'N/A'}</Cell>
        </Column>
      </Table>
    </div>
  )
}

export default Page
