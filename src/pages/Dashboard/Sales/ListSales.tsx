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
  Textarea,
  Button,
  useToaster,
  useDialog,
  Message,
} from 'rsuite'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDeleteSale, useSales } from '@/hooks/useSales'
import moment from 'moment'
import type { Sale } from '@/lib/api/sales'
import type { Company } from '@/lib/api/company'
import type { Passport } from '@/lib/api/passport'

const { Column, HeaderCell, Cell } = Table

// ========== Type for Sale with Relations (Company, Passport, Ticket, Visa) ==========
type SaleWithRelations = Sale & {
  company?: Company
  purchaseFrom?: Company
  passport?: Passport
  ticket?: {
    ticketNo: string
    issueDate: string
    sector: string
    pnr: string
    air: string
    flightDate: string
  }
  visa?: {
    country: string
    visaType: string
  }
}

// ========== List Sales Page Component ==========
const Page = () => {
  // ========== State for View Modal ==========
  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<SaleWithRelations | null>(null)

  const navigate = useNavigate()
  const toaster = useToaster()
  const { confirm } = useDialog()

  // ========== Hooks for Fetching and Deleting Sales ==========
  const { data: salesRes, isLoading, isFetching } = useSales({})
  const salesData = (salesRes?.data || []) as SaleWithRelations[]
  const { mutate: deleteSale } = useDeleteSale()

  // ========== Handle Delete Sale ==========
  const handleDelete = async (id: number) => {
    const confirmed = await confirm('Are you sure you want to delete this sale?', {
      title: 'Delete Sale',
    })

    if (confirmed) {
      deleteSale(id, {
        onSuccess: (res) => {
          toaster.push(
            <Message type="success" showIcon>
              {res.message || 'Deleted successfully'}
            </Message>,
            {
              placement: 'bottomEnd',
            },
          )
        },
      })
    }
  }

  return (
    <>
      <Divider>List Sales</Divider>
      {/* ========== Sales Table ========== */}
      <Table autoHeight bordered cellBordered data={salesData} loading={isLoading || isFetching}>
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={80}>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="type" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Company</HeaderCell>
          <Cell>{(rowData) => rowData.company?.name || 'N/A'}</Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Amount</HeaderCell>
          <Cell>{(rowData) => rowData.companyAmount?.toLocaleString() || 'N/A'}</Cell>
        </Column>

        <Column width={180}>
          <HeaderCell>Passport</HeaderCell>
          <Cell>
            {(rowData) => `${rowData.passport?.fullName} • ${rowData.passport?.passportNo}`}
          </Cell>
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Remarks</HeaderCell>
          <Cell>{(rowData) => rowData.remarks || 'N/A'}</Cell>
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
                                setViewItem(rowData as Sale)
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
                                navigate(`/edit-sales/${rowData.id}`, {
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
                                handleDelete(rowData.id)
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

      {/* ========== View Sale Modal ========== */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Sales Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewItem && (
            <Form
              formValue={{
                ...viewItem,
                company: viewItem?.company?.name,
                purchaseFrom: viewItem.purchaseFrom?.name,
                passport: `${viewItem.passport?.fullName} • ${viewItem.passport?.passportNo}`,
                ticketNumber: viewItem.ticket?.ticketNo,
                sector: viewItem.ticket?.sector,
                pnr: viewItem.ticket?.pnr,
                air: viewItem.ticket?.air,
                ticketIssueDate: viewItem.ticket?.issueDate
                  ? moment(viewItem.ticket.issueDate).format('DD-MM-YYYY')
                  : '',
                flightDate: viewItem.ticket?.flightDate
                  ? moment(viewItem.ticket.flightDate).format('DD-MM-YYYY')
                  : '',
                country: viewItem.visa?.country,
                visaType: viewItem.visa?.visaType,
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* ========== Common Fields ========== */}
                <Form.Stack fluid>
                  <Form.Group controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Control name="type" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="purchaseFrom">
                    <Form.Label>Purchase From</Form.Label>
                    <Form.Control name="purchaseFrom" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="purchaseAmount">
                    <Form.Label>Purchase Amount</Form.Label>
                    <Form.Control name="purchaseAmount" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="company">
                    <Form.Label>Company</Form.Label>
                    <Form.Control name="company" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="companyAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control name="companyAmount" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="passport">
                    <Form.Label>Passport</Form.Label>
                    <Form.Control name="passport" plaintext />
                  </Form.Group>
                </Form.Stack>

                {/* ========== Ticket Fields (Only if type is TICKET) ========== */}
                {viewItem.type === 'TICKET' && (
                  <>
                    <Form.Stack fluid>
                      <Form.Group controlId="ticketNumber">
                        <Form.Label>Ticket Number</Form.Label>
                        <Form.Control name="ticketNumber" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid>
                      <Form.Group controlId="sector">
                        <Form.Label>Sector</Form.Label>
                        <Form.Control name="sector" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid>
                      <Form.Group controlId="pnr">
                        <Form.Label>PNR</Form.Label>
                        <Form.Control name="pnr" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid>
                      <Form.Group controlId="air">
                        <Form.Label>Air</Form.Label>
                        <Form.Control name="air" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid className="">
                      <Form.Group controlId="ticketIssueDate">
                        <Form.Label>Ticket Issue Date</Form.Label>
                        <Form.Control name="ticketIssueDate" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid className="">
                      <Form.Group controlId="flightDate">
                        <Form.Label>Flight Date</Form.Label>
                        <Form.Control name="flightDate" plaintext />
                      </Form.Group>
                    </Form.Stack>
                  </>
                )}

                {/* ========== Visa Fields (Only if type is VISA) ========== */}
                {viewItem.type === 'VISA' && (
                  <>
                    <Form.Stack fluid>
                      <Form.Group controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control name="country" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid>
                      <Form.Group controlId="visaType">
                        <Form.Label>Visa Type</Form.Label>
                        <Form.Control name="visaType" plaintext />
                      </Form.Group>
                    </Form.Stack>
                  </>
                )}

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
