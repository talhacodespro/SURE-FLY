import { Icon } from '@rsuite/icons'
import { useEffect, useMemo, useState } from 'react'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { IoMdTrash } from 'react-icons/io'
import { MdOutlinePublishedWithChanges } from 'react-icons/md'
import { TiEdit } from 'react-icons/ti'

import {
  Button,
  Divider,
  Form,
  IconButton,
  Modal,
  Pagination,
  Popover,
  Progress,
  SelectPicker,
  Stat,
  StatGroup,
  Table,
  Tag,
  Textarea,
  Whisper,
  useDialog,
} from 'rsuite'

import { useNavigate } from 'react-router'

import {
  useDeletePassport,
  usePassports,
  useSearchPassports,
  useUpdatePassportStatus,
} from '@/hooks/usePassport'

import { useAgents } from '@/hooks/useAgent'

import type { PassportStatus, PassportWithRelations } from '@/lib/api/passport'

const { Column, HeaderCell, Cell } = Table

/* =========================================
   Constants
========================================= */

const PAGE_LIMIT = 20

const AGENT_PASSPORT_FILTER_KEY = 'agent-passport-filter-draft'

/* =========================================
   Passport Status Data
========================================= */

const passportStatusData = [
  {
    label: 'Received',
    value: 'RECEIVED',
  },
  {
    label: 'Processing',
    value: 'PROCESSING',
  },
  {
    label: 'Delivered',
    value: 'DELIVERED',
  },
  {
    label: 'Cancelled',
    value: 'CANCELLED',
  },
]

/* =========================================
   Filter Draft
========================================= */

type FilterDraft = {
  agentId: number | null
  passportQuery: string
}

const initialFilterDraft: FilterDraft = {
  agentId: null,
  passportQuery: '',
}

/* =========================================
   Get Saved Filter
========================================= */

const getSavedFilter = (): FilterDraft => {
  try {
    const saved = sessionStorage.getItem(AGENT_PASSPORT_FILTER_KEY)

    if (!saved) {
      return initialFilterDraft
    }

    const parsed = JSON.parse(saved)

    return {
      agentId: typeof parsed.agentId === 'number' ? parsed.agentId : null,

      passportQuery: typeof parsed.passportQuery === 'string' ? parsed.passportQuery : '',
    }
  } catch {
    try {
      sessionStorage.removeItem(AGENT_PASSPORT_FILTER_KEY)
    } catch {
      // Ignore storage error
    }

    return initialFilterDraft
  }
}

/* =========================================
   Status Color
========================================= */

const getStatusColor = (status: PassportStatus): 'blue' | 'orange' | 'green' | 'red' => {
  switch (status) {
    case 'RECEIVED':
      return 'blue'

    case 'PROCESSING':
      return 'orange'

    case 'DELIVERED':
      return 'green'

    case 'CANCELLED':
      return 'red'

    default:
      return 'blue'
  }
}

/* =========================================
   Status Label
========================================= */

const getStatusLabel = (status: PassportStatus) => {
  switch (status) {
    case 'RECEIVED':
      return 'Received'

    case 'PROCESSING':
      return 'Processing'

    case 'DELIVERED':
      return 'Delivered'

    case 'CANCELLED':
      return 'Cancelled'

    default:
      return status
  }
}

/* =========================================
   Format Date
========================================= */

const formatDate = (value?: string | null) => {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-GB').format(date)
}

/* =========================================
   Percentage
========================================= */

const getPercent = (value: number, total: number) => {
  if (!total) {
    return 0
  }

  return Math.round((value / total) * 100)
}

/* =========================================
   Page
========================================= */

const Page = () => {
  const navigate = useNavigate()

  const { confirm } = useDialog()

  /* =========================================
     Saved Filter
  ========================================= */

  const savedFilter = useMemo(() => getSavedFilter(), [])

  /* =========================================
     Filter States
  ========================================= */

  const [agentId, setAgentId] = useState<number | null>(savedFilter.agentId)

  const [passportQuery, setPassportQuery] = useState(savedFilter.passportQuery)

  /* =========================================
     Pagination State
  ========================================= */

  const [page, setPage] = useState(1)

  /* =========================================
     View State
  ========================================= */

  const [viewOpen, setViewOpen] = useState(false)

  const [viewPassport, setViewPassport] = useState<PassportWithRelations | null>(null)

  /* =========================================
     Status Modal State
  ========================================= */

  const [statusOpen, setStatusOpen] = useState(false)

  const [statusPassport, setStatusPassport] = useState<PassportWithRelations | null>(null)

  const [statusValue, setStatusValue] = useState<PassportStatus | null>(null)

  /* =========================================
     Save Filter Draft
  ========================================= */

  useEffect(() => {
    const draft: FilterDraft = {
      agentId,
      passportQuery,
    }

    try {
      sessionStorage.setItem(AGENT_PASSPORT_FILTER_KEY, JSON.stringify(draft))
    } catch {
      // Ignore storage error
    }
  }, [agentId, passportQuery])

  /* =========================================
     Agent Hook
  ========================================= */

  const { data: agentsRes, isLoading: isAgentsLoading } = useAgents()

  /* =========================================
     Passport List Hook
  ========================================= */

  const {
    data: passportsRes,
    isLoading: isPassportsLoading,
    isFetching: isPassportsFetching,
  } = usePassports(
    {
      agentId: agentId || undefined,

      query: passportQuery || undefined,

      page,
    },
    Boolean(agentId),
  )

  /* =========================================
     Passport Search Hook

     This is used for:
     - passport picker
     - full agent status count
  ========================================= */

  const { data: searchRes, isLoading: isPassportSearchLoading } = useSearchPassports(
    {
      agentId: agentId || undefined,
    },
    Boolean(agentId),
  )

  /* =========================================
     Delete Hook
  ========================================= */

  const { mutateAsync: deletePassport, isPending: isDeleting } = useDeletePassport()

  /* =========================================
     Update Status Hook
  ========================================= */

  const { mutate: updatePassportStatus, isPending: isUpdatingStatus } = useUpdatePassportStatus()

  /* =========================================
     Agents
  ========================================= */

  const agents = useMemo(() => agentsRes?.data ?? [], [agentsRes])

  /* =========================================
     Passport List

     IMPORTANT:
     meta is NOT inside data.
     data itself is the passport array.
  ========================================= */

  const passports = useMemo<PassportWithRelations[]>(() => {
    if (!agentId) {
      return []
    }

    return passportsRes?.data ?? []
  }, [passportsRes, agentId])

  /* =========================================
     Pagination Meta
  ========================================= */

  const total = agentId ? (passportsRes?.meta?.total ?? 0) : 0

  const totalPages = agentId ? (passportsRes?.meta?.totalPages ?? 0) : 0

  /* =========================================
     Fix Invalid Page

     Example:
     Page 5 has only 1 item.
     Delete it -> totalPages becomes 4.
  ========================================= */

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  /* =========================================
     Agent Picker Data
  ========================================= */

  const agentPickerData = useMemo(() => {
    return agents.map((agent) => ({
      label: agent.name,
      value: agent.id,
    }))
  }, [agents])

  /* =========================================
     Passport Picker Data
  ========================================= */

  const passportPickerData = useMemo(() => {
    return (
      searchRes?.data?.map((passport) => ({
        label: `${passport.fullName} • ${passport.passportNo}`,

        value: passport.passportNo,
      })) ?? []
    )
  }, [searchRes])

  /* =========================================
     Selected Agent
  ========================================= */

  const selectedAgent = useMemo(() => {
    if (!agentId) {
      return null
    }

    return agents.find((agent) => agent.id === agentId)
  }, [agents, agentId])

  /* =========================================
     Status Count

     This count is NOT calculated
     from current 20 rows.

     It uses the agent's full search list.
  ========================================= */

  const statusCount = useMemo(() => {
    if (!agentId) {
      return {
        total: 0,
        received: 0,
        processing: 0,
        delivered: 0,
        cancelled: 0,
      }
    }

    const agentPassports = searchRes?.data ?? []

    return {
      total: agentPassports.length,

      received: agentPassports.filter((item) => item.status === 'RECEIVED').length,

      processing: agentPassports.filter((item) => item.status === 'PROCESSING').length,

      delivered: agentPassports.filter((item) => item.status === 'DELIVERED').length,

      cancelled: agentPassports.filter((item) => item.status === 'CANCELLED').length,
    }
  }, [searchRes, agentId])

  /* =========================================
     Agent Change
  ========================================= */

  const handleAgentChange = (value: number | null) => {
    setAgentId(value)

    /*
     * New agent = new dataset.
     */
    setPassportQuery('')

    /*
     * Always return to first page.
     */
    setPage(1)

    /*
     * Reset opened modals.
     */
    setViewOpen(false)
    setViewPassport(null)

    setStatusOpen(false)
    setStatusPassport(null)
    setStatusValue(null)
  }

  /* =========================================
     Passport Search Change
  ========================================= */

  const handlePassportChange = (value: string | null) => {
    setPassportQuery(String(value || ''))

    /*
     * Search result should always
     * start from page 1.
     */
    setPage(1)
  }

  /* =========================================
     Page Change
  ========================================= */

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  /* =========================================
     View
  ========================================= */

  const handleView = (passport: PassportWithRelations) => {
    setViewPassport(passport)

    setViewOpen(true)
  }

  /* =========================================
     Edit
  ========================================= */

  const handleEdit = (passport: PassportWithRelations) => {
    navigate(`/edit-passport/${passport.id}`, {
      state: passport,
    })
  }

  /* =========================================
     Open Status Modal
  ========================================= */

  const handleStatusOpen = (passport: PassportWithRelations) => {
    setStatusPassport(passport)

    setStatusValue(passport.status)

    setStatusOpen(true)
  }

  /* =========================================
     Close Status Modal
  ========================================= */

  const handleStatusClose = () => {
    if (isUpdatingStatus) {
      return
    }

    setStatusOpen(false)

    setStatusPassport(null)

    setStatusValue(null)
  }

  /* =========================================
     Update Status
  ========================================= */

  const handleStatusUpdate = () => {
    if (!statusPassport || !statusValue) {
      return
    }

    /*
     * Same status =
     * no API request needed.
     */
    if (statusValue === statusPassport.status) {
      handleStatusClose()

      return
    }

    const passportId = statusPassport.id

    const nextStatus = statusValue

    updatePassportStatus(
      {
        id: passportId,

        payload: {
          status: nextStatus,
        },
      },
      {
        onSuccess: () => {
          setStatusOpen(false)

          setStatusPassport(null)

          setStatusValue(null)

          /*
           * View modal একই passport
           * open থাকলে immediately
           * local status update.
           */
          setViewPassport((current) => {
            if (!current || current.id !== passportId) {
              return current
            }

            return {
              ...current,

              status: nextStatus,
            }
          })
        },
      },
    )
  }

  /* =========================================
     Delete
  ========================================= */

  const handleDelete = async (passport: PassportWithRelations) => {
    const confirmed = await confirm(
      `Are you sure you want to delete passport ${passport.passportNo}?`,
      {
        title: 'Delete Passport',

        severity: 'error',

        okText: 'Delete',
      },
    )

    if (!confirmed) {
      return
    }

    await deletePassport(passport.id)

    if (viewPassport?.id === passport.id) {
      setViewOpen(false)

      setViewPassport(null)
    }

    if (statusPassport?.id === passport.id) {
      setStatusOpen(false)

      setStatusPassport(null)

      setStatusValue(null)
    }
  }

  /* =========================================
     Loading
  ========================================= */

  const loading = isAgentsLoading || isPassportsLoading || isPassportsFetching

  return (
    <>
      <div className="container mx-auto max-w-7xl">
        {/* =====================================
            Filter Section
        ===================================== */}

        <div className="mb-5 grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* =================================
              Agent
          ================================= */}

          <Form.Group>
            <SelectPicker
              data={agentPickerData}
              value={agentId}
              placeholder="Select agent"
              searchable
              cleanable
              block
              loading={isAgentsLoading}
              onChange={(value) => handleAgentChange(value as number | null)}
            />
          </Form.Group>

          {/* =================================
              Passport
          ================================= */}

          <Form.Group>
            <SelectPicker
              data={passportPickerData}
              value={passportQuery || null}
              placeholder={agentId ? 'Search passport name or number' : 'Select agent first'}
              searchable
              cleanable
              block
              disabled={!agentId}
              loading={Boolean(agentId) && isPassportSearchLoading}
              onChange={(value) => handlePassportChange(value as string | null)}
            />
          </Form.Group>
        </div>

        {/* =====================================
            Heading
        ===================================== */}

        <Divider>List Agent Passport</Divider>

        {/* =====================================
            Selected Agent
        ===================================== */}

        <>
          <div className="mb-6">
            <StatGroup spacing={20} columns={5}>
              {/* Total */}

              <Stat bordered>
                <Stat.Label>Total Passport</Stat.Label>

                <Stat.Value>{statusCount.total}</Stat.Value>

                <Progress.Line
                  percent={statusCount.total ? 100 : 0}
                  showInfo={false}
                  strokeColor="#1675e0"
                />
              </Stat>

              {/* Received */}

              <Stat bordered>
                <Stat.Label>Received</Stat.Label>

                <Stat.Value>{statusCount.received}</Stat.Value>

                <Progress.Line
                  percent={getPercent(statusCount.received, statusCount.total)}
                  showInfo={false}
                  strokeColor="#3498ff"
                />
              </Stat>

              {/* Processing */}

              <Stat bordered>
                <Stat.Label>Processing</Stat.Label>

                <Stat.Value>{statusCount.processing}</Stat.Value>

                <Progress.Line
                  percent={getPercent(statusCount.processing, statusCount.total)}
                  showInfo={false}
                  strokeColor="#ffb300"
                />
              </Stat>

              {/* Delivered */}

              <Stat bordered>
                <Stat.Label>Delivered</Stat.Label>

                <Stat.Value>{statusCount.delivered}</Stat.Value>

                <Progress.Line
                  percent={getPercent(statusCount.delivered, statusCount.total)}
                  showInfo={false}
                  strokeColor="#4caf50"
                />
              </Stat>

              {/* Cancelled */}

              <Stat bordered>
                <Stat.Label>Cancelled</Stat.Label>

                <Stat.Value>{statusCount.cancelled}</Stat.Value>

                <Progress.Line
                  percent={getPercent(statusCount.cancelled, statusCount.total)}
                  showInfo={false}
                  strokeColor="#f44336"
                />
              </Stat>
            </StatGroup>
          </div>

          {/* =================================
                  Passport Table
              ================================= */}

          <Table autoHeight bordered cellBordered rowKey="id" data={passports} loading={loading}>
            {/* ID */}

            <Column width={60} fixed align="center">
              <HeaderCell>ID</HeaderCell>

              <Cell dataKey="id" />
            </Column>

            {/* Passport Name */}

            <Column flexGrow={1} minWidth={180}>
              <HeaderCell>Passport Name</HeaderCell>

              <Cell dataKey="fullName" />
            </Column>

            {/* Passport Number */}

            <Column width={150}>
              <HeaderCell>Passport Number</HeaderCell>

              <Cell dataKey="passportNo" />
            </Column>

            {/* Phone */}

            <Column width={150}>
              <HeaderCell>Phone</HeaderCell>

              <Cell dataKey="phone" />
            </Column>

            {/* Country */}

            <Column width={150}>
              <HeaderCell>Country</HeaderCell>

              <Cell dataKey="country" />
            </Column>

            {/* Expiry */}

            <Column width={130}>
              <HeaderCell>Expire Date</HeaderCell>

              <Cell>{(rowData: PassportWithRelations) => formatDate(rowData.expiryDate)}</Cell>
            </Column>

            {/* Status */}

            <Column width={130} align="center">
              <HeaderCell>Status</HeaderCell>

              <Cell verticalAlign="middle">
                {(rowData: PassportWithRelations) => (
                  <Tag color={getStatusColor(rowData.status)}>{getStatusLabel(rowData.status)}</Tag>
                )}
              </Cell>
            </Column>

            {/* Entry By */}

            <Column flexGrow={1} minWidth={160}>
              <HeaderCell>Entry By</HeaderCell>

              <Cell>
                {(rowData: PassportWithRelations) => rowData.createdBy?.fullName || 'N/A'}
              </Cell>
            </Column>

            {/* Remarks */}

            <Column flexGrow={1} minWidth={170}>
              <HeaderCell>Remarks</HeaderCell>

              <Cell>{(rowData: PassportWithRelations) => rowData.remarks?.trim() || 'N/A'}</Cell>
            </Column>

            {/* =================================
                    Action
                ================================= */}

            <Column width={80} fixed="right" align="center">
              <HeaderCell>Action</HeaderCell>

              <Cell verticalAlign="middle">
                {(rowData: PassportWithRelations) => (
                  <Whisper
                    placement="bottomEnd"
                    trigger="click"
                    speaker={({ className, onClose, ...props }, ref) => (
                      <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                        <div className="px-2 py-2">
                          <div className="flex flex-col gap-2">
                            {/* View */}

                            <IconButton
                              icon={<Icon as={GrView} />}
                              color="green"
                              appearance="primary"
                              size="sm"
                              aria-label="View passport"
                              onClick={() => {
                                handleView(rowData)

                                onClose?.()
                              }}
                            />

                            {/* Edit */}

                            <IconButton
                              icon={<Icon as={TiEdit} />}
                              color="blue"
                              appearance="primary"
                              size="sm"
                              aria-label="Edit passport"
                              onClick={() => {
                                handleEdit(rowData)

                                onClose?.()
                              }}
                            />

                            {/* Status */}

                            <IconButton
                              icon={<Icon as={MdOutlinePublishedWithChanges} />}
                              color="violet"
                              appearance="primary"
                              size="sm"
                              aria-label="Update passport status"
                              onClick={() => {
                                handleStatusOpen(rowData)

                                onClose?.()
                              }}
                            />

                            {/* Delete */}

                            <IconButton
                              icon={<Icon as={IoMdTrash} />}
                              color="red"
                              appearance="primary"
                              size="sm"
                              loading={isDeleting}
                              disabled={isDeleting}
                              aria-label="Delete passport"
                              onClick={async () => {
                                await handleDelete(rowData)

                                onClose?.()
                              }}
                            />
                          </div>
                        </div>
                      </Popover>
                    )}
                  >
                    <IconButton
                      icon={<Icon as={CgMore} />}
                      size="xs"
                      appearance="primary"
                      aria-label="Passport actions"
                    />
                  </Whisper>
                )}
              </Cell>
            </Column>
          </Table>

          {/* =================================
                  Pagination
              ================================= */}

          {total > PAGE_LIMIT && (
            <div className="mt-5 flex justify-center">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                size="sm"
                total={total}
                limit={PAGE_LIMIT}
                activePage={page}
                maxButtons={5}
                onChangePage={handlePageChange}
              />
            </div>
          )}

          {/* =================================
                  Result Info
              ================================= */}

          {total > 0 && (
            <div className="mt-3 text-center text-xs opacity-50">
              Showing {(page - 1) * PAGE_LIMIT + 1}
              {' - '}
              {Math.min(page * PAGE_LIMIT, total)} of {total} passports
            </div>
          )}
        </>
      </div>

      {/* =========================================
          View Passport Modal
      ========================================= */}

      <Modal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false)

          setViewPassport(null)
        }}
        size="md"
        backdrop="static"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Passport Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {viewPassport && (
            <>
              {/* =================================
                  Status Header
              ================================= */}

              <div className="mb-5 flex items-center justify-between rounded-md border border-dashed p-3">
                <div>
                  <div className="text-xs opacity-60">Passport Status</div>

                  <div className="mt-1 font-medium">{viewPassport.passportNo}</div>
                </div>

                <Tag color={getStatusColor(viewPassport.status)}>
                  {getStatusLabel(viewPassport.status)}
                </Tag>
              </div>

              <Form
                formValue={{
                  fullName: viewPassport.fullName,

                  passportNo: viewPassport.passportNo,

                  dob: formatDate(viewPassport.dob),

                  nid: viewPassport.nid,

                  issueDate: formatDate(viewPassport.issueDate),

                  expiryDate: formatDate(viewPassport.expiryDate),

                  phone: viewPassport.phone,

                  whatsapp: viewPassport.whatsapp,

                  fatherName: viewPassport.fatherName,

                  fatherNid: viewPassport.fatherNid || 'N/A',

                  motherName: viewPassport.motherName,

                  motherNid: viewPassport.motherNid || 'N/A',

                  country: viewPassport.country,

                  maritalStatus: viewPassport.maritalStatus === 'MARRIED' ? 'Married' : 'Unmarried',

                  spouseName: viewPassport.spouseName || 'N/A',

                  spouseNid: viewPassport.spouseNid || 'N/A',

                  email: viewPassport.email || 'N/A',

                  agent: viewPassport.agent?.name || selectedAgent?.name || 'N/A',

                  createdBy: viewPassport.createdBy?.fullName || 'N/A',

                  remarks: viewPassport.remarks || 'N/A',
                }}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Passport Name</Form.Label>

                      <Form.Control name="fullName" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Passport Number</Form.Label>

                      <Form.Control name="passportNo" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>

                      <Form.Control name="dob" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>NID</Form.Label>

                      <Form.Control name="nid" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Issue Date</Form.Label>

                      <Form.Control name="issueDate" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Expire Date</Form.Label>

                      <Form.Control name="expiryDate" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>

                      <Form.Control name="phone" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>WhatsApp</Form.Label>

                      <Form.Control name="whatsapp" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Father Name</Form.Label>

                      <Form.Control name="fatherName" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Father NID</Form.Label>

                      <Form.Control name="fatherNid" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Mother Name</Form.Label>

                      <Form.Control name="motherName" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Mother NID</Form.Label>

                      <Form.Control name="motherNid" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>

                      <Form.Control name="country" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Marital Status</Form.Label>

                      <Form.Control name="maritalStatus" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {viewPassport.maritalStatus === 'MARRIED' && (
                    <>
                      <Form.Stack fluid>
                        <Form.Group>
                          <Form.Label>Spouse Name</Form.Label>

                          <Form.Control name="spouseName" plaintext />
                        </Form.Group>
                      </Form.Stack>

                      <Form.Stack fluid>
                        <Form.Group>
                          <Form.Label>Spouse NID</Form.Label>

                          <Form.Control name="spouseNid" plaintext />
                        </Form.Group>
                      </Form.Stack>
                    </>
                  )}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>

                      <Form.Control name="email" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Agent</Form.Label>

                      <Form.Control name="agent" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Entry By</Form.Label>

                      <Form.Control name="createdBy" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  <Form.Stack fluid className="md:col-span-2">
                    <Form.Group>
                      <Form.Label>Remarks</Form.Label>

                      <Form.Control name="remarks" accepter={Textarea} plaintext rows={2} />
                    </Form.Group>
                  </Form.Stack>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="default"
            onClick={() => {
              setViewOpen(false)

              setViewPassport(null)
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =========================================
          Update Status Modal
      ========================================= */}

      <Modal open={statusOpen} onClose={handleStatusClose} size="xs" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Update Passport Status</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {statusPassport && (
            <>
              {/* =================================
                  Passport Info
              ================================= */}

              <div className="mb-5 rounded-md border border-dashed p-3">
                <div className="text-sm font-medium">{statusPassport.fullName}</div>

                <div className="mt-1 text-xs opacity-60">{statusPassport.passportNo}</div>

                <div className="mt-3">
                  <Tag color={getStatusColor(statusPassport.status)}>
                    Current: {getStatusLabel(statusPassport.status)}
                  </Tag>
                </div>
              </div>

              {/* =================================
                  Status Picker
              ================================= */}

              <Form.Group>
                <SelectPicker
                  block
                  searchable={false}
                  cleanable={false}
                  data={passportStatusData}
                  value={statusValue}
                  placeholder="Select status"
                  disabled={isUpdatingStatus}
                  onChange={(value) => setStatusValue(value as PassportStatus)}
                />
              </Form.Group>

              {/* =================================
                  Preview
              ================================= */}

              {statusValue && (
                <div className="mt-4">
                  <div className="mb-2 text-xs opacity-60">Selected Status</div>

                  <Tag color={getStatusColor(statusValue)}>{getStatusLabel(statusValue)}</Tag>
                </div>
              )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button appearance="subtle" disabled={isUpdatingStatus} onClick={handleStatusClose}>
            Cancel
          </Button>

          <Button
            appearance="primary"
            loading={isUpdatingStatus}
            disabled={isUpdatingStatus || !statusValue}
            onClick={handleStatusUpdate}
          >
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Page
