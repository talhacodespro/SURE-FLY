import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { TiEdit } from 'react-icons/ti'
import {
  Table,
  Divider,
  IconButton,
  Whisper,
  Popover,
  Modal,
  Button,
  Form,
  Textarea,
  SelectPicker,
} from 'rsuite'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useCompanies } from '@/hooks/useCompany'
import type { Company } from '@/lib/api/company'
import { Message, toaster } from 'rsuite'
import { useDeleteCompany } from '@/hooks/useCompany'

const { Column, HeaderCell, Cell } = Table

const Page = () => {
  const navigate = useNavigate()
  const deleteMutation = useDeleteCompany()
  const { data, isLoading } = useCompanies()
  const companiesData = (data?.data ?? []) as Company[]

  type ViewCompany = Company
  const [viewOpen, setViewOpen] = useState(false)
  const [viewCompany, setViewCompany] = useState<ViewCompany | null>(null)
  const [query, setQuery] = useState('')
  const pickerData = companiesData.map((v) => ({ label: v.name, value: v.name }))
  const emptyCompany: ViewCompany = {
    id: 0,
    name: '',
    phone: '',
    contactName: '',
    contactPhone: '',
    email: '',
    address: '',
    remarks: '',
  }

  return (
    <>
      <div className="mb-3 w-80">
        <SelectPicker
          placeholder="Search by name"
          data={pickerData}
          value={query || null}
          block
          onChange={(val) => setQuery(val || '')}
        />
      </div>
      <Divider>List Company</Divider>
      <Table
        autoHeight
        bordered
        cellBordered
        data={companiesData}
        loading={isLoading}
        onRowClick={() => {}}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Company Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column width={250}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column width={180}>
          <HeaderCell>Company Mobile</HeaderCell>
          <Cell dataKey="phone" />
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Contact Person Name</HeaderCell>
          <Cell dataKey="contactName" />
        </Column>

        <Column width={180}>
          <HeaderCell>Contact Person Mobile</HeaderCell>
          <Cell dataKey="contactPhone" />
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
                                setViewCompany(rowData as ViewCompany)
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
                                deleteMutation.mutate((rowData as { id: number }).id, {
                                  onSuccess: () => {
                                    toaster.push(
                                      <Message type="success">Company deleted</Message>,
                                      { placement: 'bottomEnd' },
                                    )
                                  },
                                  onError: () => {
                                    toaster.push(<Message type="error">Failed to delete</Message>, {
                                      placement: 'bottomEnd',
                                    })
                                  },
                                })
                                if (onClose) onClose()
                              }}
                              icon={<Icon as={Trash} />}
                              color="red"
                              size="sm"
                              appearance="primary"
                              loading={deleteMutation.isPending}
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
                  <Form.Group controlId="phone">
                    <Form.Label>Company Mobile</Form.Label>
                    <Form.Control name="phone" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="contactName">
                    <Form.Label>Contact Person Name</Form.Label>
                    <Form.Control name="contactName" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="contactPhone">
                    <Form.Label>Contact Person Mobile</Form.Label>
                    <Form.Control name="contactPhone" plaintext />
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
