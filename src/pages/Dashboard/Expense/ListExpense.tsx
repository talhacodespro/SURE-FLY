import { useGetExpenses } from '@/hooks/useExpenses'
import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { Table, Divider, IconButton, Whisper, Popover } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

type Expense = {
  id: number
  amount: number
  remarks?: string | null
  category?: {
    id: number
    name: string
  } | null
  paymentMethod?: {
    id: number
    accountName: string
    bankName?: string | null
  } | null
}

// ========== List Expense Page Component ==========
const Page = () => {
  const { data: expenses, isLoading, isFetching } = useGetExpenses()

  const expenseData = (expenses?.data ?? []) as Expense[]

  return (
    <>
      <Divider>List Expense</Divider>

      <Table
        autoHeight
        bordered
        cellBordered
        data={expenseData}
        loading={isLoading || isFetching}
        rowKey="id"
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Account</HeaderCell>
          <Cell>
            {(rowData: Expense) => {
              const accountName = rowData.paymentMethod?.accountName
              const bankName = rowData.paymentMethod?.bankName

              if (!accountName && !bankName) return 'N/A'

              return bankName ? `${accountName} (${bankName})` : accountName
            }}
          </Cell>
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Category</HeaderCell>
          <Cell>{(rowData: Expense) => rowData.category?.name || 'N/A'}</Cell>
        </Column>

        <Column width={140}>
          <HeaderCell>Amount</HeaderCell>
          <Cell>{(rowData: Expense) => Number(rowData.amount || 0).toLocaleString()}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remarks</HeaderCell>
          <Cell>{(rowData: Expense) => rowData.remarks?.trim() || 'N/A'}</Cell>
        </Column>

        <Column width={80} fixed="right" align="center">
          <HeaderCell>Action</HeaderCell>

          <Cell verticalAlign="middle">
            {(rowData: Expense) => (
              <Whisper
                placement="bottomEnd"
                trigger="click"
                speaker={({ className, onClose, ...props }, ref) => {
                  return (
                    <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                      <div className="px-2 pt-2 pb-2">
                        <div className="flex flex-col items-start gap-y-2">
                          <IconButton
                            onClick={() => {
                              console.log('delete expense id:', rowData.id)
                              onClose?.()
                            }}
                            icon={<Icon as={Trash} />}
                            color="red"
                            size="sm"
                            appearance="primary"
                          >
                            Delete
                          </IconButton>
                        </div>
                      </div>
                    </Popover>
                  )
                }}
              >
                <IconButton icon={<Icon as={CgMore} />} size="xs" appearance="primary" />
              </Whisper>
            )}
          </Cell>
        </Column>
      </Table>
    </>
  )
}

export default Page
