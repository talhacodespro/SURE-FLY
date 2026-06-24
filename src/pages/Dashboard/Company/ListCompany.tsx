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
  useDialog,
  Stat,
  StatGroup,
  useBreakpointValue,
} from 'rsuite'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useCompanies, useCompanyBalance, useSearchCompanies } from '@/hooks/useCompany'
import type { Company } from '@/lib/api/company'
import { Message, toaster } from 'rsuite'
import { useDeleteCompany } from '@/hooks/useCompany'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'

const { Column, HeaderCell, Cell } = Table

// ========== List Company Page Component ==========
const Page = () => {
  const navigate = useNavigate()

  // Responsive columns for StatGroup
  const columns = useBreakpointValue(
    {
      xs: { key: 'xs', value: '1' },
      sm: { key: 'sm', value: '3' },
    },
    { defaultValue: { key: 'xs', value: '1' } },
  )

  // ========== Hooks & State ==========
  const { confirm } = useDialog()
  const [balanceId, setBalanceId] = useState(0) // Selected company ID for balance modal
  const deleteMutation = useDeleteCompany()
  const { data: searchCompaniesData } = useSearchCompanies()
  const [query, setQuery] = useState('')
  const { data, isLoading, isFetching } = useCompanies({ query })
  const companiesData = (data?.data ?? []) as Company[]

  type ViewCompany = Company
  const [viewOpen, setViewOpen] = useState(false) // View modal visibility
  const [balanceOpen, setBalanceOpen] = useState(false) // Balance modal visibility
  const { data: balanceData, isLoading: balanceLoading } = useCompanyBalance(balanceId) // Balance data
  const [viewCompany, setViewCompany] = useState<ViewCompany | null>(null)
  const pickerData =
    searchCompaniesData?.data?.map((v) => ({ label: v.name, value: String(v.id) })) ?? []
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

  // ========== Action Functions ==========
  const handleView = (company: Company) => {
    setViewCompany(company)
    setViewOpen(true)
  }

  const handleEdit = (company: Company) => {
    navigate(`/edit-company/${company.id}`, { state: company })
  }

  const handleBalance = (id: number) => {
    setBalanceId(id)
    setBalanceOpen(true)
  }

  const handleDelete = async (id: number) => {
    const confirmed = await confirm('Are you sure you want to delete this company?', {
      severity: 'error',
      title: 'Delete Company',
      okText: 'Delete',
    })

    if (!confirmed) return

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toaster.push(
          <Message type="success" showIcon>
            Company deleted
          </Message>,
          { placement: 'bottomEnd' },
        )
      },
      onError: () => {
        toaster.push(<Message type="error">Failed to delete</Message>, {
          placement: 'bottomEnd',
        })
      },
    })
  }

  return (
    <>
      {/* ========== Filter Section ========== */}
      <Divider>Filter Company</Divider>
      <div className="mb-3 w-80">
        <SelectPicker
          placeholder="Search by name"
          data={pickerData}
          value={query || null}
          block
          onChange={(val) => setQuery(val || '')}
        />
      </div>

      {/* ========== Company Table ========== */}
      <Divider>List Company</Divider>
      <Table
        autoHeight
        bordered
        cellBordered
        data={companiesData}
        loading={isLoading || isFetching}
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
                            {/* View Button */}
                            <IconButton
                              onClick={() => {
                                handleView(rowData as Company)
                                onClose?.()
                              }}
                              icon={<Icon as={GrView} />}
                              color="green"
                              size="sm"
                              appearance="primary"
                            />
                            {/* Balance Button */}
                            <IconButton
                              onClick={() => {
                                handleBalance(rowData.id)
                                onClose?.()
                              }}
                              icon={<Icon as={MdOutlineAccountBalanceWallet} />}
                              color="blue"
                              size="sm"
                              appearance="primary"
                            />
                            {/* Edit Button */}
                            <IconButton
                              onClick={() => {
                                handleEdit(rowData as Company)
                                onClose?.()
                              }}
                              icon={<Icon as={TiEdit} />}
                              color="blue"
                              size="sm"
                              appearance="primary"
                            />
                            {/* Delete Button */}
                            <IconButton
                              onClick={async () => {
                                handleDelete((rowData as { id: number }).id)
                                onClose?.()
                              }}
                              icon={<Icon as={Trash} />}
                              color="red"
                              size="sm"
                              appearance="primary"
                              loading={deleteMutation.isPending}
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

      {/* ========== View Company Modal ========== */}
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

      {/* ========== Balance Modal ========== */}
      <Modal open={balanceOpen} onClose={() => setBalanceOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Company Balance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StatGroup columns={Number(columns?.value)}>
            <Stat bordered>
              <Stat.Label uppercase className="!text-green-400">
                credit
              </Stat.Label>
              <Stat.Value>
                {balanceLoading ? '...' : Number(balanceData?.credit || 0).toLocaleString()}
              </Stat.Value>
            </Stat>
            <Stat bordered>
              <Stat.Label uppercase className="!text-red-400">
                debit
              </Stat.Label>
              <Stat.Value>
                {balanceLoading ? '...' : Number(balanceData?.debit || 0).toLocaleString()}
              </Stat.Value>
            </Stat>
            <Stat bordered>
              <Stat.Label className="!text-blue-400" uppercase>
                balance
              </Stat.Label>
              <Stat.Value
                className={
                  Number(balanceData?.balance || 0) < 0 ? '!text-red-400' : '!text-green-400'
                }
              >
                {balanceLoading ? '...' : Number(balanceData?.balance || 0).toLocaleString()}
              </Stat.Value>
            </Stat>
          </StatGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="default" onClick={() => setBalanceOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Page
