import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { TiEdit } from 'react-icons/ti'
import { Table, Divider, IconButton, Whisper, Popover } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

// Table data
const data = [
  {
    id: 1,
    name: 'John',
    number: 'A15858199',
    dateOfBirth: '2-2-2000',
    expireDate: '2-2-2025',
    mobile: '0123456789',
    email: 'john@example.com',
    remark: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 2,
    name: 'Jane',
    number: 'Doe',
    dateOfBirth: '2-2-2000',
    expireDate: '2-2-2025',
    mobile: '0123456789',
    email: 'jane@example.com',
    remark: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
]

const Page = () => {
  return (
    <>
      <Divider>List Passport</Divider>
      <Table
        autoHeight
        bordered
        cellBordered
        data={data}
        onRowClick={(rowData) => {
          console.log(rowData)
        }}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Passport Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={150}>
          <HeaderCell>Passport Number</HeaderCell>
          <Cell dataKey="number" />
        </Column>

        <Column width={120}>
          <HeaderCell>Date of Birth</HeaderCell>
          <Cell dataKey="dateOfBirth" />
        </Column>

        <Column width={120}>
          <HeaderCell>Expire Date</HeaderCell>
          <Cell dataKey="expireDate" />
        </Column>

        {/* <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Mobile</HeaderCell>
          <Cell dataKey="mobile" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column> */}

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remark</HeaderCell>
          <Cell dataKey="remark" />
        </Column>

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
                              icon={<Icon as={GrView} />}
                              color="green"
                              size="sm"
                              appearance="primary"
                            >
                              View
                            </IconButton>

                            <IconButton
                              onClick={() => {
                                if (onClose) onClose()
                              }}
                              icon={<Icon as={TiEdit} />}
                              color="blue"
                              size="sm"
                              appearance="primary"
                            >
                              Edit
                            </IconButton>

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
