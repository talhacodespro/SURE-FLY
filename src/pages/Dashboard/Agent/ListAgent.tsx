/**
 * Agent list page.
 * Displays searchable agent rows with
 * pagination, view, edit and delete controls.
 */

import { Icon, Trash } from '@rsuite/icons'
import { useEffect, useMemo, useState } from 'react'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
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
  Textarea,
  Whisper,
  useDialog,
} from 'rsuite'

import { useNavigate } from 'react-router'

import { useAgents, useDeleteAgent, useSearchAgents } from '@/hooks/useAgent'

import type { Agent } from '@/lib/api/agent'

const { Column, HeaderCell, Cell } = Table

/* =========================================
   Constants
========================================= */

const PAGE_LIMIT = 20

/* =========================================
   Page
========================================= */

const Page = () => {
  const navigate = useNavigate()

  const { confirm } = useDialog()

  /* =========================================
     State
  ========================================= */

  const [query, setQuery] = useState('')

  const [page, setPage] = useState(1)

  const [viewOpen, setViewOpen] = useState(false)

  const [viewAgent, setViewAgent] = useState<Agent | null>(null)

  /* =========================================
     Agent List Hook
  ========================================= */

  const {
    data: agentsRes,
    isLoading,
    isFetching,
  } = useAgents({
    query: query || undefined,

    page,
  })

  /* =========================================
     Search Hook
  ========================================= */

  const { data: searchRes, isLoading: isSearchLoading } = useSearchAgents()

  /* =========================================
     Delete Hook
  ========================================= */

  const {
    mutateAsync: deleteAgent,

    isPending: isDeleting,
  } = useDeleteAgent()

  /* =========================================
     Agents
  ========================================= */

  const agents = useMemo<Agent[]>(() => agentsRes?.data ?? [], [agentsRes])

  /* =========================================
     Search Picker Data
  ========================================= */

  const pickerData = useMemo(() => {
    return (
      searchRes?.data?.map((agent) => ({
        label: `${agent.name} • ${agent.phone}`,

        value: agent.name,
      })) ?? []
    )
  }, [searchRes])

  /* =========================================
     Pagination
  ========================================= */

  const total = agentsRes?.meta?.total ?? 0

  const totalPages = agentsRes?.meta?.totalPages ?? 0

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
     * New search always
     * starts from page 1.
     */
    setPage(1)
  }

  /* =========================================
     View Agent
  ========================================= */

  const handleView = (agent: Agent) => {
    setViewAgent(agent)

    setViewOpen(true)
  }

  /* =========================================
     Edit Agent
  ========================================= */

  const handleEdit = (agent: Agent) => {
    navigate(`/edit-agent/${agent.id}`, {
      state: agent,
    })
  }

  /* =========================================
     Delete Agent
  ========================================= */

  const handleDelete = async (agent: Agent) => {
    const confirmed = await confirm(`Are you sure you want to delete ${agent.name}?`, {
      severity: 'error',

      title: 'Delete Agent',

      okText: 'Delete',
    })

    if (!confirmed) {
      return
    }

    await deleteAgent(agent.id)

    if (viewAgent?.id === agent.id) {
      setViewOpen(false)

      setViewAgent(null)
    }
  }

  return (
    <>
      <div className="container mx-auto max-w-7xl">
        {/* =====================================
            Search
        ===================================== */}

        <div className="mb-3 w-full md:w-80">
          <SelectPicker
            placeholder="Search by agent name"
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

        <Divider>List Agent</Divider>

        {/* =====================================
            Table
        ===================================== */}

        <Table
          autoHeight
          bordered
          cellBordered
          data={agents}
          rowKey="id"
          loading={isLoading || isFetching}
        >
          {/* ID */}

          <Column width={70} align="center" fixed>
            <HeaderCell>ID</HeaderCell>

            <Cell dataKey="id" />
          </Column>

          {/* Agent Name */}

          <Column flexGrow={1} minWidth={180}>
            <HeaderCell>Agent Name</HeaderCell>

            <Cell dataKey="name" />
          </Column>

          {/* Phone */}

          <Column width={150}>
            <HeaderCell>Phone</HeaderCell>

            <Cell>{(rowData: Agent) => rowData.phone || 'N/A'}</Cell>
          </Column>

          {/* WhatsApp */}

          <Column width={150}>
            <HeaderCell>WhatsApp</HeaderCell>

            <Cell>{(rowData: Agent) => rowData.whatsapp || 'N/A'}</Cell>
          </Column>

          {/* Email */}

          <Column flexGrow={1} minWidth={220}>
            <HeaderCell>Email</HeaderCell>

            <Cell>{(rowData: Agent) => rowData.email || 'N/A'}</Cell>
          </Column>

          {/* Remarks */}

          <Column flexGrow={1} minWidth={180}>
            <HeaderCell>Remarks</HeaderCell>

            <Cell>{(rowData: Agent) => rowData.remarks?.trim() || 'N/A'}</Cell>
          </Column>

          {/* =====================================
              Action
          ===================================== */}

          <Column width={80} fixed="right" align="center">
            <HeaderCell>Action</HeaderCell>

            <Cell verticalAlign="middle">
              {(rowData: Agent) => (
                <Whisper
                  placement="bottomEnd"
                  trigger="click"
                  speaker={({ className, onClose, ...props }, ref) => (
                    <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                      <div className="px-2 py-2">
                        <div className="flex flex-col items-start gap-y-2">
                          {/* View */}

                          <IconButton
                            icon={<Icon as={GrView} />}
                            color="green"
                            size="sm"
                            appearance="primary"
                            aria-label="View agent"
                            onClick={() => {
                              handleView(rowData)

                              onClose?.()
                            }}
                          />

                          {/* Edit */}

                          <IconButton
                            icon={<Icon as={TiEdit} />}
                            color="blue"
                            size="sm"
                            appearance="primary"
                            aria-label="Edit agent"
                            onClick={() => {
                              handleEdit(rowData)

                              onClose?.()
                            }}
                          />

                          {/* Delete */}

                          <IconButton
                            icon={<Icon as={Trash} />}
                            color="red"
                            size="sm"
                            appearance="primary"
                            loading={isDeleting}
                            disabled={isDeleting}
                            aria-label="Delete agent"
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
                    aria-label="Agent actions"
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
            {Math.min(page * PAGE_LIMIT, total)} of {total} agents
          </div>
        )}
      </div>

      {/* =========================================
          View Agent Modal
      ========================================= */}

      <Modal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false)

          setViewAgent(null)
        }}
        size="md"
        backdrop="static"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Agent Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {viewAgent && (
            <Form
              formValue={{
                name: viewAgent.name || 'N/A',

                phone: viewAgent.phone || 'N/A',

                whatsapp: viewAgent.whatsapp || 'N/A',

                email: viewAgent.email || 'N/A',

                address: viewAgent.address || 'N/A',

                remarks: viewAgent.remarks || 'N/A',
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Agent Name */}

                <Form.Stack fluid>
                  <Form.Group>
                    <Form.Label>Agent Name</Form.Label>

                    <Form.Control name="name" plaintext />
                  </Form.Group>
                </Form.Stack>

                {/* Phone */}

                <Form.Stack fluid>
                  <Form.Group>
                    <Form.Label>Agent Phone</Form.Label>

                    <Form.Control name="phone" plaintext />
                  </Form.Group>
                </Form.Stack>

                {/* WhatsApp */}

                <Form.Stack fluid>
                  <Form.Group>
                    <Form.Label>Agent WhatsApp</Form.Label>

                    <Form.Control name="whatsapp" plaintext />
                  </Form.Group>
                </Form.Stack>

                {/* Email */}

                <Form.Stack fluid>
                  <Form.Group>
                    <Form.Label>Agent Email</Form.Label>

                    <Form.Control name="email" plaintext />
                  </Form.Group>
                </Form.Stack>

                {/* Address */}

                <Form.Stack fluid className="md:col-span-2">
                  <Form.Group>
                    <Form.Label>Agent Address</Form.Label>

                    <Form.Control name="address" accepter={Textarea} plaintext rows={2} />
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
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="default"
            onClick={() => {
              setViewOpen(false)

              setViewAgent(null)
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Page
