import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { TiEdit } from 'react-icons/ti'
import { Table, Divider, IconButton, Whisper, Popover, Modal, Button, Form, Textarea } from 'rsuite'
import { useNavigate } from 'react-router'
import { useState } from 'react'

const { Column, HeaderCell, Cell } = Table

// Table data
const data = [
  {
    id: 1,
    name: 'SURE FLY LTD ',
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
    remarks:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. alksdf al;ksdfmalsdf alsdkfnal;sdkfna;lksdf asodkfjmal;skdf aoksdfn;alskdf, ;alksdlfapskdf ',
  },
]

const Page = () => {
  const navigate = useNavigate()
  type Company = {
    id: number
    name: string
    mobile: string
    contactPersonName: string
    contactPersonMobile: string
    email: string
    address: string
    remarks: string
  }
  const [viewOpen, setViewOpen] = useState(false)
  const [viewCompany, setViewCompany] = useState<Company | null>(null)
  const emptyCompany: Company = {
    id: 0,
    name: '',
    mobile: '',
    contactPersonName: '',
    contactPersonMobile: '',
    email: '',
    address: '',
    remarks: '',
  }
  return (
    <>
      <Divider>List Company</Divider>
      <Table autoHeight bordered cellBordered data={data} onRowClick={() => {}}>
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

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remarks</HeaderCell>
          <Cell dataKey="remarks" />
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
                                setViewCompany(rowData as Company)
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
                                navigate(`/edit-company/${(rowData as { id: number }).id}`)
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
          <Modal.Title>Company Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewCompany && (
            <Form formValue={viewCompany || emptyCompany}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <Form.Stack fluid>
                  <Form.Group controlId="name">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control name="name" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="mobile">
                    <Form.Label>Company Mobile</Form.Label>
                    <Form.Control name="mobile" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="contactPersonName">
                    <Form.Label>Contact Person Name</Form.Label>
                    <Form.Control name="contactPersonName" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="contactPersonMobile">
                    <Form.Label>Contact Person Mobile</Form.Label>
                    <Form.Control name="contactPersonMobile" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control name="address" accepter={Textarea} plaintext rows={2} />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group controlId="remarks">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control name="remarks" accepter={Textarea} plaintext rows={2} />
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
