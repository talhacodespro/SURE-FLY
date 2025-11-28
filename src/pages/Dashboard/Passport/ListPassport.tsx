import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { TiEdit } from 'react-icons/ti'
import { Table, Divider, IconButton, Whisper, Popover } from 'rsuite'

const { Column, HeaderCell, Cell } = Table

// Table data
const data = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    age: 30,
    postcode: '1234',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'Female',
    age: 25,
    postcode: '5678',
  },
]

const Page = () => {
  return (
    <>
      <Divider>List Agent</Divider>
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
          <HeaderCell>First Name</HeaderCell>
          <Cell dataKey="firstName" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Last Name</HeaderCell>
          <Cell dataKey="lastName" />
        </Column>

        <Column flexGrow={1} minWidth={100}>
          <HeaderCell>Gender</HeaderCell>
          <Cell dataKey="gender" />
        </Column>

        <Column flexGrow={1} minWidth={100}>
          <HeaderCell>Age</HeaderCell>
          <Cell dataKey="age" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Postcode</HeaderCell>
          <Cell dataKey="postcode" />
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
                                onClose()
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
                                onClose()
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
