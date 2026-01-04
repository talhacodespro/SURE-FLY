import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { TiEdit } from 'react-icons/ti'
import { Table, Divider, IconButton, Whisper, Popover, Modal, Form, Button, Textarea } from 'rsuite'
import { useState } from 'react'
import { useNavigate } from 'react-router'

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

type PassportItem = {
  id: number
  name: string
  number: string
  dateOfBirth: string | Date | null
  expireDate: string | Date | null
  mobile: string
  email: string
  remark: string
}

const Page = () => {
  const navigate = useNavigate()
  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<PassportItem | null>(null)

  return (
    <>
      <Divider>List Passport</Divider>
      <Table autoHeight bordered cellBordered data={data} onRowClick={() => {}}>
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
            {(rowData) => (
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
                                setViewItem(rowData as PassportItem)
                                setViewOpen(true)
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
                                navigate(`/edit-passport/${(rowData as { id: number }).id}`, {
                                  state: rowData,
                                })
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
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Passport Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewItem && (
            <Form formValue={viewItem}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <Form.Stack fluid>
                  <Form.Group controlId="name">
                    <Form.Label>Passport Name</Form.Label>
                    <Form.Control name="name" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="number">
                    <Form.Label>Passport Number</Form.Label>
                    <Form.Control name="number" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="dateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control name="dateOfBirth" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="expireDate">
                    <Form.Label>Expire Date</Form.Label>
                    <Form.Control name="expireDate" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="mobile">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control name="mobile" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group controlId="remark">
                    <Form.Label>Remark</Form.Label>
                    <Form.Control name="remark" accepter={Textarea} plaintext rows={2} />
                  </Form.Group>
                </Form.Stack>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="default" onClick={() => setViewOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Page
