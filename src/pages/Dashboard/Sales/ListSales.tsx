import { Icon, Trash } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { TiEdit } from 'react-icons/ti'
import { Table, Divider, IconButton, Whisper, Popover, Modal, Form, Textarea, Button } from 'rsuite'
import { useState } from 'react'
import { useNavigate } from 'react-router'

const { Column, HeaderCell, Cell } = Table

// Table data
const data = [
  {
    id: 1,
    type: 'Ticket',
    purchaseFrom: 'SURE FLY LTD',
    purchaseAmount: '9000000',
    company: 'Company A',
    amount: '10000000',
    passport: '1234567890',
    remarks: 'Remark 1',
  },
  {
    id: 2,
    type: 'Visa',
    purchaseFrom: 'Jane',
    purchaseAmount: '1500',
    company: 'Company B',
    amount: '2000',
    passport: '0987654321',
    remarks: 'Remark 2',
  },
]

type SalesItem = {
  id: number
  type: 'Ticket' | 'Visa' | string
  purchaseFrom?: string
  purchaseAmount?: string | number
  company: string
  amount: string | number
  passport: string
  remarks: string
  // Optional fields per type
  ticketNumber?: string
  sector?: string
  ticketIssueDate?: Date | string | null
  pnr?: string
  air?: string
  flightDate?: Date | string | null
  country?: string
  visaType?: string
}

const Page = () => {
  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<SalesItem | null>(null)
  const navigate = useNavigate()
  return (
    <>
      <Divider>List Sales</Divider>
      <Table autoHeight bordered cellBordered data={data} onRowClick={() => {}}>
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
          <Cell dataKey="company" />
        </Column>

        <Column width={100}>
          <HeaderCell>Amount</HeaderCell>
          <Cell dataKey="amount" />
        </Column>

        <Column width={150}>
          <HeaderCell>Passport</HeaderCell>
          <Cell dataKey="passport" />
        </Column>

        <Column flexGrow={1} minWidth={150}>
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
                                setViewItem(rowData as SalesItem)
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
                                navigate(`/edit-sales/${(rowData as { id: number }).id}`, {
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
          <Modal.Title>Sales Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewItem && (
            <Form formValue={viewItem}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Common fields */}
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
                  <Form.Group controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control name="amount" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid>
                  <Form.Group controlId="passport">
                    <Form.Label>Passport</Form.Label>
                    <Form.Control name="passport" plaintext />
                  </Form.Group>
                </Form.Stack>
                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group controlId="remarks">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control name="remarks" accepter={Textarea} plaintext rows={2} />
                  </Form.Group>
                </Form.Stack>

                {/* Ticket fields */}
                {String(viewItem.type).toLowerCase() === 'ticket' && (
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
                    <Form.Stack fluid className="md:col-span-2">
                      <Form.Group controlId="ticketIssueDate">
                        <Form.Label>Ticket Issue Date</Form.Label>
                        <Form.Control name="ticketIssueDate" plaintext />
                      </Form.Group>
                    </Form.Stack>
                    <Form.Stack fluid className="md:col-span-2">
                      <Form.Group controlId="flightDate">
                        <Form.Label>Flight Date</Form.Label>
                        <Form.Control name="flightDate" plaintext />
                      </Form.Group>
                    </Form.Stack>
                  </>
                )}

                {/* Visa fields */}
                {String(viewItem.type).toLowerCase() === 'visa' && (
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
