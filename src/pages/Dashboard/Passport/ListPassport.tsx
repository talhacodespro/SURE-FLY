/**
 * Passport list page.
 * Shows searchable passport rows with
 * view, edit, status update, delete and pagination.
 */

import { Icon, Trash } from '@rsuite/icons'
import { useEffect, useState } from 'react'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
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
  SelectPicker,
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

import type { PassportStatus, PassportWithRelations } from '@/lib/api/passport'

const { Column, HeaderCell, Cell } = Table

/* =========================================
   Constants
========================================= */

const PAGE_LIMIT = 20

/* =========================================
   Status Data
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
   Page
========================================= */

const Page = () => {
  const navigate = useNavigate()

  const { confirm } = useDialog()

  /* =========================================
     States
  ========================================= */

  const [viewOpen, setViewOpen] = useState(false)

  const [viewItem, setViewItem] = useState<PassportWithRelations | null>(null)

  const [query, setQuery] = useState('')

  const [page, setPage] = useState(1)

  /* =========================================
     Status Modal State
  ========================================= */

  const [statusOpen, setStatusOpen] = useState(false)

  const [statusPassport, setStatusPassport] = useState<PassportWithRelations | null>(null)

  const [statusValue, setStatusValue] = useState<PassportStatus | null>(null)

  /* =========================================
     Search Hook
  ========================================= */

  const {
    data: searchPassportsData,

    isLoading: isSearchLoading,
  } = useSearchPassports()

  /* =========================================
     Passport List Hook
  ========================================= */

  const {
    data: passportsRes,
    isLoading,
    isFetching,
  } = usePassports({
    query: query || undefined,

    page,
  })

  /* =========================================
     Delete Hook
  ========================================= */

  const {
    mutateAsync: deletePassport,

    isPending: isDeleting,
  } = useDeletePassport()

  /* =========================================
     Status Update Hook
  ========================================= */

  const {
    mutate: updatePassportStatus,

    isPending: isUpdatingStatus,
  } = useUpdatePassportStatus()

  /* =========================================
     Search Picker Data
  ========================================= */

  /* =========================================
   Search Picker Data
========================================= */

  const pickerData =
    searchPassportsData?.data?.map((passport) => ({
      label: `${passport.fullName} • ${passport.passportNo}${
        passport.agent?.name ? ` • ${passport.agent.name}` : ''
      }`,

      value: passport.passportNo,
    })) ?? []

  /* =========================================
     Passport List
  ========================================= */

  const passports = (passportsRes?.data ?? []) as PassportWithRelations[]

  /* =========================================
     Pagination Meta
  ========================================= */

  const total = passportsRes?.meta?.total ?? 0

  const totalPages = passportsRes?.meta?.totalPages ?? 0

  /* =========================================
     Fix Invalid Page
  ========================================= */

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  /* =========================================
     Search Change
  ========================================= */

  const handleSearchChange = (value: string | null) => {
    setQuery(value || '')

    /*
     * নতুন search করলে
     * page 1 থেকে শুরু হবে.
     */
    setPage(1)
  }

  /* =========================================
     View
  ========================================= */

  const handleView = (passport: PassportWithRelations) => {
    setViewItem(passport)

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
           * View modal same passport
           * open থাকলে local status update.
           */
          setViewItem((current) => {
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
        severity: 'error',

        title: 'Delete Passport',

        okText: 'Delete',
      },
    )

    if (!confirmed) {
      return
    }

    await deletePassport(passport.id)

    if (viewItem?.id === passport.id) {
      setViewOpen(false)

      setViewItem(null)
    }

    if (statusPassport?.id === passport.id) {
      setStatusOpen(false)

      setStatusPassport(null)

      setStatusValue(null)
    }
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl">
        {/* =====================================
            Search
        ===================================== */}

        <div className="mb-3 w-full md:w-96">
          <SelectPicker
            placeholder="Search passport name or number"
            data={pickerData}
            value={query || null}
            searchable
            cleanable
            block
            loading={isSearchLoading}
            onChange={(value) => handleSearchChange(value as string | null)}
          />
        </div>

        {/* =====================================
            Heading
        ===================================== */}

        <Divider>List Passport</Divider>

        {/* =====================================
            Passport Table
        ===================================== */}

        <Table
          autoHeight
          bordered
          cellBordered
          rowKey="id"
          data={passports}
          loading={isLoading || isFetching}
        >
          {/* ID */}

          <Column width={60} align="center" fixed>
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

          {/* =====================================
              Agent
          ===================================== */}

          <Column flexGrow={1} minWidth={160}>
            <HeaderCell>Agent</HeaderCell>

            <Cell>{(rowData: PassportWithRelations) => rowData.agent?.name || 'N/A'}</Cell>
          </Column>

          {/* Country */}

          <Column width={150}>
            <HeaderCell>Country</HeaderCell>

            <Cell>{(rowData: PassportWithRelations) => rowData.country || 'N/A'}</Cell>
          </Column>

          {/* Phone */}

          <Column width={140}>
            <HeaderCell>Phone</HeaderCell>

            <Cell>{(rowData: PassportWithRelations) => rowData.phone || 'N/A'}</Cell>
          </Column>

          {/* Expire Date */}

          <Column width={130}>
            <HeaderCell>Expire Date</HeaderCell>

            <Cell>{(rowData: PassportWithRelations) => formatDate(rowData.expiryDate)}</Cell>
          </Column>

          {/* =====================================
              Status
          ===================================== */}

          <Column width={130} align="center">
            <HeaderCell>Status</HeaderCell>

            <Cell verticalAlign="middle">
              {(rowData: PassportWithRelations) => (
                <Tag color={getStatusColor(rowData.status)}>{getStatusLabel(rowData.status)}</Tag>
              )}
            </Cell>
          </Column>

          {/* Marital Status */}

          <Column width={130}>
            <HeaderCell>Marital Status</HeaderCell>

            <Cell>
              {(rowData: PassportWithRelations) => (
                <Tag>
                  {rowData.maritalStatus === 'MARRIED'
                    ? 'Married'
                    : rowData.maritalStatus === 'UNMARRIED'
                      ? 'Unmarried'
                      : 'N/A'}
                </Tag>
              )}
            </Cell>
          </Column>

          {/* Entry By */}

          <Column flexGrow={1} minWidth={150}>
            <HeaderCell>Entry By</HeaderCell>

            <Cell>{(rowData: PassportWithRelations) => rowData.createdBy?.fullName || 'N/A'}</Cell>
          </Column>

          {/* Remarks */}

          <Column flexGrow={1} minWidth={180}>
            <HeaderCell>Remarks</HeaderCell>

            <Cell>{(rowData: PassportWithRelations) => rowData.remarks?.trim() || 'N/A'}</Cell>
          </Column>

          {/* =====================================
              Action
          ===================================== */}

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
                        <div className="flex flex-col items-start gap-y-2">
                          {/* View */}

                          <IconButton
                            aria-label="View passport"
                            onClick={() => {
                              handleView(rowData)

                              onClose?.()
                            }}
                            icon={<Icon as={GrView} />}
                            color="green"
                            size="sm"
                            appearance="primary"
                          />

                          {/* Edit */}

                          <IconButton
                            aria-label="Edit passport"
                            onClick={() => {
                              handleEdit(rowData)

                              onClose?.()
                            }}
                            icon={<Icon as={TiEdit} />}
                            color="blue"
                            size="sm"
                            appearance="primary"
                          />

                          {/* Status */}

                          <IconButton
                            aria-label="Update passport status"
                            onClick={() => {
                              handleStatusOpen(rowData)

                              onClose?.()
                            }}
                            icon={<Icon as={MdOutlinePublishedWithChanges} />}
                            color="violet"
                            size="sm"
                            appearance="primary"
                          />

                          {/* Delete */}

                          <IconButton
                            aria-label="Delete passport"
                            onClick={async () => {
                              await handleDelete(rowData)

                              onClose?.()
                            }}
                            icon={<Icon as={Trash} />}
                            color="red"
                            size="sm"
                            appearance="primary"
                            loading={isDeleting}
                            disabled={isDeleting}
                          />
                        </div>
                      </div>
                    </Popover>
                  )}
                >
                  <IconButton
                    aria-label="Passport actions"
                    icon={<Icon as={CgMore} />}
                    size="xs"
                    appearance="primary"
                  />
                </Whisper>
              )}
            </Cell>
          </Column>
        </Table>

        {/* =====================================
            Pagination
        ===================================== */}

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
              onChangePage={setPage}
            />
          </div>
        )}

        {/* =====================================
            Pagination Info
        ===================================== */}

        {total > 0 && (
          <div className="mt-3 text-center text-xs opacity-50">
            Showing {(page - 1) * PAGE_LIMIT + 1}
            {' - '}
            {Math.min(page * PAGE_LIMIT, total)} of {total} passports
          </div>
        )}
      </div>

      {/* =========================================
          View Passport Modal
      ========================================= */}

      <Modal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false)

          setViewItem(null)
        }}
        size="md"
        backdrop="static"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Passport Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {viewItem && (
            <>
              {/* =================================
                  Status Summary
              ================================= */}

              <div className="mb-5 flex items-center justify-between rounded-md border border-dashed p-3">
                <div>
                  <div className="text-xs opacity-60">Status</div>

                  <div className="mt-1 font-medium">{viewItem.passportNo}</div>
                </div>

                <Tag color={getStatusColor(viewItem.status)}>{getStatusLabel(viewItem.status)}</Tag>
              </div>

              <Form
                formValue={{
                  fullName: viewItem.fullName,

                  passportNo: viewItem.passportNo,

                  agent: viewItem.agent?.name || 'N/A',

                  dob: formatDate(viewItem.dob),

                  nid: viewItem.nid || 'N/A',

                  issueDate: formatDate(viewItem.issueDate),

                  expiryDate: formatDate(viewItem.expiryDate),

                  phone: viewItem.phone || 'N/A',

                  whatsapp: viewItem.whatsapp || 'N/A',

                  email: viewItem.email || 'N/A',

                  country: viewItem.country || 'N/A',

                  maritalStatus: viewItem.maritalStatus === 'MARRIED' ? 'Married' : 'Unmarried',

                  fatherName: viewItem.fatherName || 'N/A',

                  fatherNid: viewItem.fatherNid || 'N/A',

                  motherName: viewItem.motherName || 'N/A',

                  motherNid: viewItem.motherNid || 'N/A',

                  spouseName: viewItem.spouseName || 'N/A',

                  spouseNid: viewItem.spouseNid || 'N/A',

                  createdBy: viewItem.createdBy?.fullName || 'N/A',

                  remarks: viewItem.remarks?.trim() || 'N/A',
                }}
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                  {/* Passport Name */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Passport Name</Form.Label>

                      <Form.Control name="fullName" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Passport Number */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Passport Number</Form.Label>

                      <Form.Control name="passportNo" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Agent */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Agent</Form.Label>

                      <Form.Control name="agent" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Entry By */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Entry By</Form.Label>

                      <Form.Control name="createdBy" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* DOB */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Date of Birth</Form.Label>

                      <Form.Control name="dob" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* NID */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>NID</Form.Label>

                      <Form.Control name="nid" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Issue */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Issue Date</Form.Label>

                      <Form.Control name="issueDate" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Expiry */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Expire Date</Form.Label>

                      <Form.Control name="expiryDate" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Country */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Country</Form.Label>

                      <Form.Control name="country" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Marital */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Marital Status</Form.Label>

                      <Form.Control name="maritalStatus" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Phone */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>

                      <Form.Control name="phone" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* WhatsApp */}

                  <Form.Stack fluid>
                    <Form.Group>
                      <Form.Label>WhatsApp</Form.Label>

                      <Form.Control name="whatsapp" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Father */}

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

                  {/* Mother */}

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

                  {/* Spouse */}

                  {viewItem.maritalStatus === 'MARRIED' && (
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

                  {/* Email */}

                  <Form.Stack fluid className="md:col-span-2">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>

                      <Form.Control name="email" plaintext />
                    </Form.Group>
                  </Form.Stack>

                  {/* Remarks */}

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

              setViewItem(null)
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
              {/* Passport */}

              <div className="mb-5 rounded-md border border-dashed p-3">
                <div className="font-medium">{statusPassport.fullName}</div>

                <div className="mt-1 text-sm opacity-60">{statusPassport.passportNo}</div>

                <div className="mt-3">
                  <Tag color={getStatusColor(statusPassport.status)}>
                    Current: {getStatusLabel(statusPassport.status)}
                  </Tag>
                </div>
              </div>

              {/* Status Picker */}

              <Form.Group>
                <SelectPicker
                  block
                  searchable={false}
                  cleanable={false}
                  data={passportStatusData}
                  value={statusValue}
                  disabled={isUpdatingStatus}
                  placeholder="Select status"
                  onChange={(value) => setStatusValue(value as PassportStatus)}
                />
              </Form.Group>

              {/* Preview */}

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
