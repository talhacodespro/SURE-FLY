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
    name: 'SURE FLY LTD SDFLSKDFJOSDIFKJNSODIFKNOSDILFKNOSDLIFKNSDOLIFKNOSDILKFODSLIKFNOSDLKFN<ODLSFK',
    mobile: '0123456789',
    contactPersonName: 'Doe',
    contactPersonMobile: '0123456789',
    email: 'john@example.com',
    address: '123 Main St',
    remarks: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: 2,
    name: 'Jane',
    mobile: '0123456789',
    contactPersonName: 'Doe',
    contactPersonMobile: '0123456789',
    email: 'jane@example.com',
    address: '456 Main St',
    remarks: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
]

const Page = () => {
  return (
    <>
      <Divider>List Company</Divider>
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

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Company Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={180}>
          <HeaderCell>Company Mobile</HeaderCell>
          <Cell dataKey="mobile" />
        </Column>

        {/* <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Contact Person Name</HeaderCell>
          <Cell dataKey="contactPersonName" />
        </Column> */}

        <Column width={180}>
          <HeaderCell>Contact Person Mobile</HeaderCell>
          <Cell dataKey="contactPersonMobile" />
        </Column>

        {/* <Column flexGrow={2} minWidth={150}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column> */}
        {/* <Column flexGrow={2} minWidth={200}>
          <HeaderCell>Company Address</HeaderCell>
          <Cell dataKey="address" />
        </Column> */}
        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remarks</HeaderCell>
          <Cell dataKey="remarks" />
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
