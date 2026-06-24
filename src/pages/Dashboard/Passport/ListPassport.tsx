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
  Form,
  Button,
  Textarea,
  Message,
  useToaster,
  useDialog,
  SelectPicker,
} from 'rsuite'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDeletePassport, usePassports, useSearchPassports } from '@/hooks/usePassport'
import type { Passport } from '@/lib/api/passport'
import moment from 'moment'

const { Column, HeaderCell, Cell } = Table

// ========== List Passport Page Component ==========
const Page = () => {
  const navigate = useNavigate()
  const toaster = useToaster()
  const { confirm } = useDialog()

  // ========== State for View Modal and Filter Query ==========
  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<Passport | null>(null)
  const [query, setQuery] = useState('')

  // ========== Hooks for Fetching and Deleting Passports ==========
  const { data: searchPassportsData } = useSearchPassports()
  const { data: passportsRes, isLoading, isFetching } = usePassports({ query })
  const { mutate: deletePassport } = useDeletePassport()

  // ========== Filter Select Picker Data ==========
  const pickerData =
    searchPassportsData?.data?.map((v) => ({
      label: `${v.fullName} • ${v.passportNo}`,
      value: v.passportNo,
    })) ?? []

  // ========== Handle Delete Passport ==========
  const handleDelete = async (id: number) => {
    const confirmed = await confirm('Are you sure you want to delete this passport?', {
      severity: 'error',
      title: 'Delete Passport',
      okText: 'Delete',
    })

    if (confirmed) {
      deletePassport(id, {
        onSuccess: () => {
          toaster.push(<Message type="success">Passport deleted successfully</Message>, {
            placement: 'bottomEnd',
          })
        },
      })
    }
  }

  const passports = passportsRes?.data || []

  return (
    <>
      <Divider>Filter Passport</Divider>
      <div className="mb-3 w-80">
        {/* ========== Passport Filter Select Picker ========== */}
        <SelectPicker
          placeholder="Search by name or number"
          data={pickerData}
          value={query || null}
          block
          onChange={(val) => setQuery(val || '')}
        />
      </div>
      <Divider>List Passport</Divider>
      {/* ========== Passport Table ========== */}
      <Table
        autoHeight
        bordered
        cellBordered
        data={passports}
        loading={isLoading || isFetching}
        onRowClick={() => {}}
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Passport Name</HeaderCell>
          <Cell dataKey="fullName" />
        </Column>

        <Column width={150}>
          <HeaderCell>Passport Number</HeaderCell>
          <Cell dataKey="passportNo" />
        </Column>

        <Column width={120}>
          <HeaderCell>Date of Birth</HeaderCell>
          <Cell>{(rowData) => moment(rowData.dob).format('DD-MM-YYYY')}</Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Expire Date</HeaderCell>
          <Cell>{(rowData) => moment(rowData.expiryDate).format('DD-MM-YYYY')}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remark</HeaderCell>
          <Cell dataKey="remarks" />
        </Column>

        {/* ========== Action Column with Popover Menu ========== */}
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
                            {/* View Button */}
                            <IconButton
                              onClick={() => {
                                setViewItem(rowData as Passport)
                                setViewOpen(true)
                                if (onClose) onClose()
                              }}
                              icon={<Icon as={GrView} />}
                              color="green"
                              size="sm"
                              appearance="primary"
                            />

                            {/* Edit Button */}
                            <IconButton
                              onClick={() => {
                                navigate(`/edit-passport/${(rowData as Passport).id}`, {
                                  state: rowData,
                                })
                                if (onClose) onClose()
                              }}
                              icon={<Icon as={TiEdit} />}
                              color="blue"
                              size="sm"
                              appearance="primary"
                            />

                            {/* Delete Button */}
                            <IconButton
                              onClick={() => {
                                handleDelete((rowData as Passport).id)
                                if (onClose) onClose()
                              }}
                              icon={<Icon as={Trash} />}
                              color="red"
                              size="sm"
                              appearance="primary"
                            />
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

      {/* ========== View Passport Modal ========== */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Passport Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewItem && (
            <Form
              formValue={{
                ...viewItem,
                dob: moment(viewItem.dob).format('DD-MM-YYYY'),
                expiryDate: moment(viewItem.expiryDate).format('DD-MM-YYYY'),
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <Form.Stack fluid>
                  <Form.Group controlId="fullName">
                    <Form.Label>Passport Name</Form.Label>
                    <Form.Control name="fullName" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="passportNo">
                    <Form.Label>Passport Number</Form.Label>
                    <Form.Control name="passportNo" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="dob">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control name="dob" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="expiryDate">
                    <Form.Label>Expire Date</Form.Label>
                    <Form.Control name="expiryDate" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="phone">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control name="phone" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group controlId="remarks">
                    <Form.Label>Remark</Form.Label>
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
