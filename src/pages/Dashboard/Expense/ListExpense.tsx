import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { Table, Divider, IconButton, Whisper, Popover } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

// ========== Mock Expense List Data ==========
const data = [
  {
    id: 1,
    account: 'Cash',
    category: 'Food',
    amount: 1200,
    remarks: 'Lunch meeting with client.',
  },
  {
    id: 2,
    account: 'Bank',
    category: 'Transport',
    amount: 350,
    remarks: 'Taxi fare to client office.',
  },
]

// ========== List Expense Page Component ==========
const Page = () => {
  return (
    <>
      <Divider>List Expense</Divider>
      {/* ========== Expense Table ========== */}
      <Table autoHeight bordered cellBordered data={data}>
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Account</HeaderCell>
          <Cell dataKey="account" />
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Category</HeaderCell>
          <Cell dataKey="category" />
        </Column>

        <Column width={140}>
          <HeaderCell>Amount</HeaderCell>
          <Cell dataKey="amount" />
        </Column>

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remarks</HeaderCell>
          <Cell dataKey="remarks" />
        </Column>

        {/* ========== Action Column with Popover Menu ========== */}
        <Column width={80} fixed="right" align="center">
          <HeaderCell>Action</HeaderCell>

          <Cell verticalAlign="middle">
            {() => (
              <Whisper
                placement="bottomEnd"
                trigger="click"
                speaker={({ className, onClose, ...props }, ref) => {
                  return (
                    <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                      <>
                        <div className="px-2 pt-2 pb-2">
                          <div className="flex flex-col items-start gap-y-2">
                            <IconButton
                              onClick={() => {
                                if (onClose) onClose()
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
                      </>
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
