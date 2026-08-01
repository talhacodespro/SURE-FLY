import { useMemo, useState } from 'react'
import {
  Button,
  DateRangePicker,
  Divider,
  Form,
  IconButton,
  Input,
  InputGroup,
  Message,
  Modal,
  Popover,
  SelectPicker,
  Table,
  Tag,
  Textarea,
  toaster,
  Whisper,
} from 'rsuite'
import { Icon } from '@rsuite/icons'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { MdOutlineUpdate } from 'react-icons/md'
import { IoSearch } from 'react-icons/io5'
import { IoMdClose, IoMdSave } from 'react-icons/io'

const { Column, HeaderCell, Cell } = Table

type TicketStatus = 'OPEN' | 'USED' | 'CANCELLED' | 'REFUNDED' | 'VOID' | 'REISSUED'

type TicketRow = {
  id: number
  ticketNo: string
  sector: string
  pnr: string
  air: string
  issueDate: string
  flightDate: string
  status: TicketStatus
  sale?: {
    id: number
    purchaseAmount: number
    companyAmount: number
    remarks?: string | null
    passport?: {
      fullName: string
      passportNo: string
      phone?: string | null
    } | null
    company?: {
      name: string
    } | null
    purchaseFrom?: {
      name: string
    } | null
  } | null
}

const statusData = [
  { label: 'Open', value: 'OPEN' },
  { label: 'Used', value: 'USED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Refunded', value: 'REFUNDED' },
  { label: 'Void', value: 'VOID' },
  { label: 'Reissued', value: 'REISSUED' },
]

const statusColorMap: Record<TicketStatus, string> = {
  OPEN: 'blue',
  USED: 'green',
  CANCELLED: 'red',
  REFUNDED: 'orange',
  VOID: 'violet',
  REISSUED: 'cyan',
}

const mockTickets: TicketRow[] = [
  {
    id: 1,
    ticketNo: '157-1234567890',
    sector: 'DAC-DXB',
    pnr: 'ABCD12',
    air: 'Emirates',
    issueDate: '2026-07-20T10:00:00.000Z',
    flightDate: '2026-07-28T22:30:00.000Z',
    status: 'REISSUED',
    sale: {
      id: 11,
      purchaseAmount: 50000,
      companyAmount: 60000,
      remarks: 'Client confirmed',
      passport: {
        fullName: 'Abdullah Talha',
        passportNo: 'A12345678',
        phone: '01700000000',
      },
      company: {
        name: 'ABC Travels',
      },
      purchaseFrom: {
        name: 'XYZ Air',
      },
    },
  },
]

const Page = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TicketStatus | null>(null)
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null)

  const [viewOpen, setViewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null)

  const [updateValue, setUpdateValue] = useState<{
    status: TicketStatus | null
    remarks: string
  }>({
    status: null,
    remarks: '',
  })

  const tickets = mockTickets

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const keyword = search.trim().toLowerCase()

      const matchSearch =
        !keyword ||
        ticket.ticketNo.toLowerCase().includes(keyword) ||
        ticket.pnr.toLowerCase().includes(keyword) ||
        ticket.sector.toLowerCase().includes(keyword) ||
        ticket.sale?.passport?.fullName?.toLowerCase().includes(keyword) ||
        ticket.sale?.passport?.passportNo?.toLowerCase().includes(keyword)

      const matchStatus = !status || ticket.status === status

      const matchDate =
        !dateRange ||
        (new Date(ticket.flightDate) >= dateRange[0] && new Date(ticket.flightDate) <= dateRange[1])

      return matchSearch && matchStatus && matchDate
    })
  }, [tickets, search, status, dateRange])

  const handleView = (ticket: TicketRow) => {
    setSelectedTicket(ticket)
    setViewOpen(true)
  }

  const handleUpdateClick = (ticket: TicketRow) => {
    setSelectedTicket(ticket)
    setUpdateValue({
      status: ticket.status,
      remarks: '',
    })
    setUpdateOpen(true)
  }

  const handleUpdateStatus = () => {
    if (!selectedTicket || !updateValue.status) return

    // ekhane mutation call korba
    // updateTicketStatus({ id: selectedTicket.id, payload: updateValue })

    toaster.push(
      <Message type="success" showIcon>
        Ticket status updated successfully
      </Message>,
      { placement: 'bottomEnd' },
    )

    setUpdateOpen(false)
  }

  const showValue = (value?: string | null) => value?.trim() || 'N/A'

  return (
    <>
      <Divider>Ticket Status Management</Divider>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <InputGroup inside>
          <InputGroup.Addon>
            <Icon as={IoSearch} />
          </InputGroup.Addon>
          <Input
            placeholder="Search ticket, PNR, passenger"
            value={search}
            onChange={(value) => setSearch(value)}
          />
        </InputGroup>

        <SelectPicker
          placeholder="Filter by status"
          data={statusData}
          value={status}
          onChange={(value) => setStatus(value as TicketStatus | null)}
          block
        />

        <DateRangePicker
          placeholder="Flight date range"
          value={dateRange}
          onChange={(value) => setDateRange(value as [Date, Date] | null)}
          format="dd-MM-yyyy"
          block
        />

        <Button
          appearance="default"
          onClick={() => {
            setSearch('')
            setStatus(null)
            setDateRange(null)
          }}
        >
          Reset Filter
        </Button>
      </div>

      <Table autoHeight bordered cellBordered data={filteredTickets} rowKey="id">
        <Column width={70} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={160} fixed>
          <HeaderCell>Ticket No</HeaderCell>
          <Cell dataKey="ticketNo" />
        </Column>

        <Column flexGrow={1} minWidth={180}>
          <HeaderCell>Passenger</HeaderCell>
          <Cell>{(rowData: TicketRow) => showValue(rowData.sale?.passport?.fullName)}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={180}>
          <HeaderCell>Company</HeaderCell>
          <Cell>{(rowData: TicketRow) => showValue(rowData.sale?.company?.name)}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={180}>
          <HeaderCell>Purchase From</HeaderCell>
          <Cell>{(rowData: TicketRow) => showValue(rowData.sale?.purchaseFrom?.name)}</Cell>
        </Column>

        <Column width={130}>
          <HeaderCell>Sector</HeaderCell>
          <Cell dataKey="sector" />
        </Column>

        <Column width={110}>
          <HeaderCell>PNR</HeaderCell>
          <Cell dataKey="pnr" />
        </Column>

        <Column width={150}>
          <HeaderCell>Airline</HeaderCell>
          <Cell dataKey="air" />
        </Column>

        <Column width={140}>
          <HeaderCell>Flight Date</HeaderCell>
          <Cell>
            {(rowData: TicketRow) =>
              rowData.flightDate ? new Date(rowData.flightDate).toLocaleDateString() : 'N/A'
            }
          </Cell>
        </Column>

        <Column width={120}>
          <HeaderCell>Status</HeaderCell>
          <Cell>
            {(rowData: TicketRow) => (
              <Tag color={statusColorMap[rowData.status]}>{rowData.status}</Tag>
            )}
          </Cell>
        </Column>

        <Column width={80} fixed="right" align="center">
          <HeaderCell>Action</HeaderCell>
          <Cell verticalAlign="middle">
            {(rowData: TicketRow) => (
              <Whisper
                placement="bottomEnd"
                trigger="click"
                speaker={({ className, onClose, ...props }, ref) => (
                  <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                    <div className="px-2 pt-2 pb-2">
                      <div className="flex flex-col items-start gap-y-2">
                        <IconButton
                          icon={<Icon as={GrView} />}
                          color="green"
                          size="sm"
                          appearance="primary"
                          onClick={() => {
                            handleView(rowData)
                            onClose?.()
                          }}
                        >
                          View
                        </IconButton>

                        <IconButton
                          icon={<Icon as={MdOutlineUpdate} />}
                          color="blue"
                          size="sm"
                          appearance="primary"
                          onClick={() => {
                            handleUpdateClick(rowData)
                            onClose?.()
                          }}
                        >
                          Update
                        </IconButton>
                      </div>
                    </div>
                  </Popover>
                )}
              >
                <IconButton icon={<Icon as={CgMore} />} size="xs" appearance="primary" />
              </Whisper>
            )}
          </Cell>
        </Column>
      </Table>

      <Modal open={viewOpen} onClose={() => setViewOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTicket && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Ticket No</div>
                <div>{showValue(selectedTicket.ticketNo)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Status</div>
                <Tag color={statusColorMap[selectedTicket.status]}>{selectedTicket.status}</Tag>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Passenger</div>
                <div>{showValue(selectedTicket.sale?.passport?.fullName)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Passport No</div>
                <div>{showValue(selectedTicket.sale?.passport?.passportNo)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Company</div>
                <div>{showValue(selectedTicket.sale?.company?.name)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Purchase From</div>
                <div>{showValue(selectedTicket.sale?.purchaseFrom?.name)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Sector</div>
                <div>{showValue(selectedTicket.sector)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">PNR</div>
                <div>{showValue(selectedTicket.pnr)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Airline</div>
                <div>{showValue(selectedTicket.air)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Flight Date</div>
                <div>
                  {selectedTicket.flightDate
                    ? new Date(selectedTicket.flightDate).toLocaleString()
                    : 'N/A'}
                </div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Purchase Amount</div>
                <div>{Number(selectedTicket.sale?.purchaseAmount || 0).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Company Amount</div>
                <div>{Number(selectedTicket.sale?.companyAmount || 0).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Profit</div>
                <div>
                  {Number(
                    Number(selectedTicket.sale?.companyAmount || 0) -
                      Number(selectedTicket.sale?.purchaseAmount || 0),
                  ).toLocaleString()}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-sm text-[var(--rs-text-secondary)]">Sale Remarks</div>
                <div>{showValue(selectedTicket.sale?.remarks)}</div>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="default" onClick={() => setViewOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={updateOpen} onClose={() => setUpdateOpen(false)} size="xs" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Update Ticket Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedTicket && (
            <Form
              formValue={updateValue}
              onChange={(value) => setUpdateValue(value as typeof updateValue)}
            >
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <div className="text-sm text-[var(--rs-text-secondary)]">Ticket No</div>
                  <div>{selectedTicket.ticketNo}</div>
                </div>

                <div>
                  <div className="text-sm text-[var(--rs-text-secondary)]">Current Status</div>
                  <Tag color={statusColorMap[selectedTicket.status]}>{selectedTicket.status}</Tag>
                </div>

                <Form.Stack fluid>
                  <Form.Group controlId="status">
                    <Form.Label>New Status</Form.Label>
                    <Form.Control
                      name="status"
                      accepter={SelectPicker}
                      data={statusData}
                      cleanable={false}
                      searchable={false}
                      block
                    />
                  </Form.Group>
                </Form.Stack>

                <Form.Stack fluid>
                  <Form.Group controlId="remarks">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control name="remarks" accepter={Textarea} rows={2} />
                  </Form.Group>
                </Form.Stack>
              </div>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="default"
            startIcon={<Icon as={IoMdClose} />}
            onClick={() => setUpdateOpen(false)}
          >
            Cancel
          </Button>

          <Button
            appearance="primary"
            startIcon={<Icon as={IoMdSave} />}
            onClick={handleUpdateStatus}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Page
