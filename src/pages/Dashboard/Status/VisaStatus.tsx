import { useMemo, useState } from 'react'
import {
  Button,
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

type VisaStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED'

type VisaRow = {
  id: number
  country: string
  visaType: string
  status: VisaStatus
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
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Expired', value: 'EXPIRED' },
]

const statusColorMap: Record<VisaStatus, string> = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
  CANCELLED: 'violet',
  EXPIRED: 'blue',
}

// পরে API data দিয়ে replace করবে
const mockVisas: VisaRow[] = [
  {
    id: 1,
    country: 'Saudi Arabia',
    visaType: 'Umrah Visa',
    status: 'PENDING',
    sale: {
      id: 10,
      purchaseAmount: 20000,
      companyAmount: 25000,
      remarks: 'Waiting for approval',
      passport: {
        fullName: 'Abdullah Talha',
        passportNo: 'A12345678',
        phone: '01700000000',
      },
      company: {
        name: 'ABC Travels',
      },
      purchaseFrom: {
        name: 'Visa Supplier Ltd',
      },
    },
  },
]

const Page = () => {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<VisaStatus | null>(null)
  const [country, setCountry] = useState<string | null>(null)

  const [viewOpen, setViewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [selectedVisa, setSelectedVisa] = useState<VisaRow | null>(null)

  const [updateValue, setUpdateValue] = useState<{
    status: VisaStatus | null
    remarks: string
  }>({
    status: null,
    remarks: '',
  })

  const visas = mockVisas

  const countryData = useMemo(() => {
    const uniqueCountries = Array.from(new Set(visas.map((visa) => visa.country)))

    return uniqueCountries.map((item) => ({
      label: item,
      value: item,
    }))
  }, [visas])

  const filteredVisas = useMemo(() => {
    return visas.filter((visa) => {
      const keyword = search.trim().toLowerCase()

      const matchSearch =
        !keyword ||
        visa.country.toLowerCase().includes(keyword) ||
        visa.visaType.toLowerCase().includes(keyword) ||
        visa.sale?.passport?.fullName?.toLowerCase().includes(keyword) ||
        visa.sale?.passport?.passportNo?.toLowerCase().includes(keyword) ||
        visa.sale?.company?.name?.toLowerCase().includes(keyword)

      const matchStatus = !status || visa.status === status

      const matchCountry = !country || visa.country === country

      return matchSearch && matchStatus && matchCountry
    })
  }, [visas, search, status, country])

  const showValue = (value?: string | null) => value?.trim() || 'N/A'

  const handleView = (visa: VisaRow) => {
    setSelectedVisa(visa)
    setViewOpen(true)
  }

  const handleUpdateClick = (visa: VisaRow) => {
    setSelectedVisa(visa)
    setUpdateValue({
      status: visa.status,
      remarks: '',
    })
    setUpdateOpen(true)
  }

  const handleUpdateStatus = () => {
    if (!selectedVisa || !updateValue.status) return

    // ekhane mutation call korba
    // updateVisaStatus({
    //   id: selectedVisa.id,
    //   payload: updateValue,
    // })

    toaster.push(
      <Message type="success" showIcon>
        Visa status updated successfully
      </Message>,
      { placement: 'bottomEnd' },
    )

    setUpdateOpen(false)
  }

  return (
    <>
      <Divider>Visa Status Management</Divider>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <InputGroup inside>
          <InputGroup.Addon>
            <Icon as={IoSearch} />
          </InputGroup.Addon>
          <Input
            placeholder="Search visa, passenger, passport"
            value={search}
            onChange={(value) => setSearch(value)}
          />
        </InputGroup>

        <SelectPicker
          placeholder="Filter by status"
          data={statusData}
          value={status}
          onChange={(value) => setStatus(value as VisaStatus | null)}
          block
        />

        <SelectPicker
          placeholder="Filter by country"
          data={countryData}
          value={country}
          onChange={(value) => setCountry(value)}
          block
        />

        <Button
          appearance="default"
          onClick={() => {
            setSearch('')
            setStatus(null)
            setCountry(null)
          }}
        >
          Reset Filter
        </Button>
      </div>

      <Table autoHeight bordered cellBordered data={filteredVisas} rowKey="id">
        <Column width={70} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={180} fixed>
          <HeaderCell>Passenger</HeaderCell>
          <Cell>{(rowData: VisaRow) => showValue(rowData.sale?.passport?.fullName)}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={150}>
          <HeaderCell>Passport No</HeaderCell>
          <Cell>{(rowData: VisaRow) => showValue(rowData.sale?.passport?.passportNo)}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={180}>
          <HeaderCell>Company</HeaderCell>
          <Cell>{(rowData: VisaRow) => showValue(rowData.sale?.company?.name)}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={180}>
          <HeaderCell>Purchase From</HeaderCell>
          <Cell>{(rowData: VisaRow) => showValue(rowData.sale?.purchaseFrom?.name)}</Cell>
        </Column>

        <Column flexGrow={1} minWidth={160}>
          <HeaderCell>Country</HeaderCell>
          <Cell dataKey="country" />
        </Column>

        <Column flexGrow={1} minWidth={180}>
          <HeaderCell>Visa Type</HeaderCell>
          <Cell dataKey="visaType" />
        </Column>

        <Column width={120}>
          <HeaderCell>Status</HeaderCell>
          <Cell>
            {(rowData: VisaRow) => (
              <Tag color={statusColorMap[rowData.status]}>{rowData.status}</Tag>
            )}
          </Cell>
        </Column>

        <Column width={80} fixed="right" align="center">
          <HeaderCell>Action</HeaderCell>

          <Cell verticalAlign="middle">
            {(rowData: VisaRow) => (
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
          <Modal.Title>Visa Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedVisa && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Passenger</div>
                <div>{showValue(selectedVisa.sale?.passport?.fullName)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Passport No</div>
                <div>{showValue(selectedVisa.sale?.passport?.passportNo)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Phone</div>
                <div>{showValue(selectedVisa.sale?.passport?.phone)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Status</div>
                <Tag color={statusColorMap[selectedVisa.status]}>{selectedVisa.status}</Tag>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Country</div>
                <div>{showValue(selectedVisa.country)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Visa Type</div>
                <div>{showValue(selectedVisa.visaType)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Company</div>
                <div>{showValue(selectedVisa.sale?.company?.name)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Purchase From</div>
                <div>{showValue(selectedVisa.sale?.purchaseFrom?.name)}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Purchase Amount</div>
                <div>{Number(selectedVisa.sale?.purchaseAmount || 0).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Company Amount</div>
                <div>{Number(selectedVisa.sale?.companyAmount || 0).toLocaleString()}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--rs-text-secondary)]">Profit</div>
                <div>
                  {Number(
                    Number(selectedVisa.sale?.companyAmount || 0) -
                      Number(selectedVisa.sale?.purchaseAmount || 0),
                  ).toLocaleString()}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-sm text-[var(--rs-text-secondary)]">Sale Remarks</div>
                <div>{showValue(selectedVisa.sale?.remarks)}</div>
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
          <Modal.Title>Update Visa Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedVisa && (
            <Form
              formValue={updateValue}
              onChange={(value) => setUpdateValue(value as typeof updateValue)}
            >
              <div className="grid grid-cols-1 gap-y-4">
                <div>
                  <div className="text-sm text-[var(--rs-text-secondary)]">Passenger</div>
                  <div>{showValue(selectedVisa.sale?.passport?.fullName)}</div>
                </div>

                <div>
                  <div className="text-sm text-[var(--rs-text-secondary)]">Current Status</div>
                  <Tag color={statusColorMap[selectedVisa.status]}>{selectedVisa.status}</Tag>
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
