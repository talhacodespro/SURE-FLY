import { useEffect, useMemo, useRef, useState } from 'react'

import {
  Button,
  Divider,
  Form,
  Heading,
  IconButton,
  Message,
  Modal,
  Panel,
  PasswordInput,
  Popover,
  Schema,
  Table,
  Tag,
  Whisper,
  toaster,
} from 'rsuite'

import type { FormInstance } from 'rsuite'

import { Icon } from '@rsuite/icons'

import { Link } from 'react-router'

import {
  IoMdAdd,
  IoMdArrowBack,
  IoMdCheckmarkCircle,
  IoMdClose,
  IoMdKey,
  IoMdRemoveCircle,
  IoMdSave,
} from 'react-icons/io'

import { FaUserEdit } from 'react-icons/fa'

import { CgMore } from 'react-icons/cg'

import { useCreateUser, useUpdateProfile, useUpdateUser, useUsers } from '@/hooks/useUser'

import { useImpersonateUser, useMe } from '@/hooks/useAuth'

import type { User } from '@/lib/api/user'
import { MdOutlineFlightTakeoff } from 'react-icons/md'

const { Column, HeaderCell, Cell } = Table

const { StringType } = Schema.Types

/* =========================================
   Types
========================================= */

type ProfileFormValue = {
  fullName: string

  email: string

  phone: string

  password: string
}

type CreateAgentFormValue = {
  fullName: string

  email: string

  phone: string

  password: string
}

type EditAgentFormValue = {
  id: number

  fullName: string

  email: string

  phone: string

  isActive: boolean
}

/* =========================================
   Initial Profile
========================================= */

const initialProfile: ProfileFormValue = {
  fullName: '',

  email: '',

  phone: '',

  password: '',
}

/* =========================================
   Initial Agent
========================================= */

const initialAgentValue: CreateAgentFormValue = {
  fullName: '',

  email: '',

  phone: '',

  password: '',
}

/* =========================================
   Initial Reset Password
========================================= */

const initialResetPassword = {
  newPassword: '',

  confirmPassword: '',
}

/* =========================================
   Page
========================================= */

const Page = () => {
  /* =========================================
     Current User
  ========================================= */

  const {
    data: meRes,

    isLoading: isMeLoading,
  } = useMe()

  const user = meRes?.data

  /* =========================================
     Users
  ========================================= */

  const {
    data: usersRes,

    isLoading: isUsersLoading,

    isFetching: isUsersFetching,
  } = useUsers(user?.role === 'ADMIN')

  /* =========================================
     Mutations
  ========================================= */

  const updateProfileMutation = useUpdateProfile()

  const createUserMutation = useCreateUser()

  const updateUserMutation = useUpdateUser()

  const {
    mutate: impersonateUser,

    isPending: isImpersonating,
  } = useImpersonateUser()

  /* =========================================
     Form Refs
  ========================================= */

  const profileFormRef = useRef<FormInstance>(null)

  const createAgentFormRef = useRef<FormInstance>(null)

  const editAgentFormRef = useRef<FormInstance>(null)

  /* =========================================
     Profile State
  ========================================= */

  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const [profileValue, setProfileValue] = useState<ProfileFormValue>(initialProfile)

  /* =========================================
     Create Agent State
  ========================================= */

  const [createAgentOpen, setCreateAgentOpen] = useState(false)

  const [newAgent, setNewAgent] = useState<CreateAgentFormValue>(initialAgentValue)

  /* =========================================
     Edit Agent State
  ========================================= */

  const [editAgentOpen, setEditAgentOpen] = useState(false)

  const [editingAgent, setEditingAgent] = useState<EditAgentFormValue | null>(null)

  /* =========================================
     Reset Password State
  ========================================= */

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const [selectedAgent, setSelectedAgent] = useState<User | null>(null)

  const [resetPassword, setResetPassword] = useState(initialResetPassword)

  /* =========================================
     Populate Current Profile
  ========================================= */

  useEffect(() => {
    if (!user) {
      return
    }

    setProfileValue({
      fullName: user.fullName || '',

      email: user.email || '',

      phone: user.phone || '',

      /*
       * Password কখনো backend
       * থেকে frontend-এ আসবে না।
       */
      password: '',
    })
  }, [user])

  /* =========================================
     Agents
  ========================================= */

  const agents = useMemo(() => {
    return usersRes?.data?.filter((item) => item.role === 'AGENT') ?? []
  }, [usersRes])

  /* =========================================
     Profile Validation
  ========================================= */

  const profileModel = useMemo(
    () =>
      Schema.Model({
        fullName: StringType().isRequired('Full name is required.'),

        email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),

        phone: StringType().isRequired('Phone is required.'),

        password: StringType().addRule(
          (value) => {
            /*
             * Password optional.
             */
            if (!value) {
              return true
            }

            return value.length >= 6
          },

          'Password must be at least 6 characters.',
        ),
      }),

    [],
  )

  /* =========================================
     Create Agent Validation
  ========================================= */

  const createAgentModel = useMemo(
    () =>
      Schema.Model({
        fullName: StringType().isRequired('Full name is required.'),

        email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),

        phone: StringType().isRequired('Mobile is required.'),

        password: StringType()
          .isRequired('Password is required.')
          .addRule(
            (value) => value.length >= 6,

            'Password must be at least 6 characters.',
          ),
      }),

    [],
  )

  /* =========================================
     Edit Agent Validation
  ========================================= */

  const editAgentModel = useMemo(
    () =>
      Schema.Model({
        fullName: StringType().isRequired('Full name is required.'),

        email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),

        phone: StringType().isRequired('Mobile is required.'),
      }),

    [],
  )

  /* =========================================
     Open Edit Profile
  ========================================= */

  const handleEditProfileOpen = () => {
    setProfileValue((prev) => ({
      ...prev,

      password: '',
    }))

    setEditProfileOpen(true)
  }

  /* =========================================
     Close Edit Profile
  ========================================= */

  const handleEditProfileClose = () => {
    if (updateProfileMutation.isPending) {
      return
    }

    setEditProfileOpen(false)

    setProfileValue((prev) => ({
      ...prev,

      password: '',
    }))
  }

  /* =========================================
     Update Own Profile
  ========================================= */

  const handleProfileSubmit = () => {
    const valid = profileFormRef.current?.check()

    if (!valid) {
      return
    }

    const password = profileValue.password.trim()

    updateProfileMutation.mutate(
      {
        fullName: profileValue.fullName.trim(),

        email: profileValue.email.trim(),

        phone: profileValue.phone.trim(),

        ...(password && {
          password,
        }),
      },

      {
        onSuccess: () => {
          setEditProfileOpen(false)

          setProfileValue((prev) => ({
            ...prev,

            password: '',
          }))
        },
      },
    )
  }

  /* =========================================
     Open Create Agent
  ========================================= */

  const handleCreateAgentOpen = () => {
    setNewAgent(initialAgentValue)

    setCreateAgentOpen(true)
  }

  /* =========================================
     Close Create Agent
  ========================================= */

  const handleCreateAgentClose = () => {
    if (createUserMutation.isPending) {
      return
    }

    setCreateAgentOpen(false)

    setNewAgent(initialAgentValue)
  }

  /* =========================================
     Create Agent
  ========================================= */

  const handleCreateAgent = () => {
    const valid = createAgentFormRef.current?.check()

    if (!valid) {
      return
    }

    createUserMutation.mutate(
      {
        fullName: newAgent.fullName.trim(),

        email: newAgent.email.trim(),

        phone: newAgent.phone.trim(),

        password: newAgent.password,

        /*
         * Profile থেকে শুধু
         * AGENT create করা যাবে।
         */
        role: 'AGENT',
      },

      {
        onSuccess: () => {
          setCreateAgentOpen(false)

          setNewAgent(initialAgentValue)

          toaster.push(
            <Message type="success" showIcon>
              Agent account created successfully
            </Message>,

            {
              placement: 'bottomEnd',
            },
          )
        },
      },
    )
  }

  /* =========================================
     Open Edit Agent
  ========================================= */

  const handleEditAgentOpen = (agent: User) => {
    setEditingAgent({
      id: agent.id,

      fullName: agent.fullName,

      email: agent.email,

      phone: agent.phone || '',

      isActive: agent.isActive,
    })

    setEditAgentOpen(true)
  }

  /* =========================================
     Close Edit Agent
  ========================================= */

  const handleEditAgentClose = () => {
    if (updateUserMutation.isPending) {
      return
    }

    setEditAgentOpen(false)

    setEditingAgent(null)
  }

  /* =========================================
     Update Agent
  ========================================= */

  const handleUpdateAgent = () => {
    const valid = editAgentFormRef.current?.check()

    if (!valid || !editingAgent) {
      return
    }

    updateUserMutation.mutate(
      {
        id: editingAgent.id,

        payload: {
          fullName: editingAgent.fullName.trim(),

          email: editingAgent.email.trim(),

          phone: editingAgent.phone.trim(),
        },
      },

      {
        onSuccess: () => {
          setEditAgentOpen(false)

          setEditingAgent(null)

          toaster.push(
            <Message type="success" showIcon>
              Agent updated successfully
            </Message>,

            {
              placement: 'bottomEnd',
            },
          )
        },
      },
    )
  }

  /* =========================================
     Toggle Agent Status
  ========================================= */

  const handleToggleAgentStatus = (agent: User) => {
    updateUserMutation.mutate(
      {
        id: agent.id,

        payload: {
          isActive: !agent.isActive,
        },
      },

      {
        onSuccess: () => {
          toaster.push(
            <Message type="success" showIcon>
              Agent {agent.isActive ? 'disabled' : 'enabled'} successfully
            </Message>,

            {
              placement: 'bottomEnd',
            },
          )
        },
      },
    )
  }

  /* =========================================
     Open Reset Password
  ========================================= */

  const handleResetPasswordOpen = (agent: User) => {
    setSelectedAgent(agent)

    setResetPassword(initialResetPassword)

    setResetPasswordOpen(true)
  }

  /* =========================================
     Close Reset Password
  ========================================= */

  const handleResetPasswordClose = () => {
    if (updateUserMutation.isPending) {
      return
    }

    setResetPasswordOpen(false)

    setSelectedAgent(null)

    setResetPassword(initialResetPassword)
  }

  /* =========================================
     Reset Agent Password
  ========================================= */

  const handleResetPassword = () => {
    if (!selectedAgent) {
      return
    }

    const newPassword = resetPassword.newPassword.trim()

    const confirmPassword = resetPassword.confirmPassword.trim()

    /* =====================================
         Password Length
      ===================================== */

    if (newPassword.length < 6) {
      toaster.push(
        <Message type="error" showIcon>
          Password must be at least 6 characters
        </Message>,

        {
          placement: 'bottomEnd',
        },
      )

      return
    }

    /* =====================================
         Password Match
      ===================================== */

    if (newPassword !== confirmPassword) {
      toaster.push(
        <Message type="error" showIcon>
          Password doesn't match
        </Message>,

        {
          placement: 'bottomEnd',
        },
      )

      return
    }

    /* =====================================
         Update
      ===================================== */

    updateUserMutation.mutate(
      {
        id: selectedAgent.id,

        payload: {
          password: newPassword,
        },
      },

      {
        onSuccess: () => {
          setResetPasswordOpen(false)

          setSelectedAgent(null)

          setResetPassword(initialResetPassword)

          toaster.push(
            <Message type="success" showIcon>
              Agent password reset successfully
            </Message>,

            {
              placement: 'bottomEnd',
            },
          )
        },
      },
    )
  }

  /* =========================================
     Login As Agent
  ========================================= */

  const handleLoginAsAgent = (agent: User, onClose?: () => void) => {
    if (!agent.isActive) {
      toaster.push(
        <Message type="warning" showIcon>
          Disabled agent account cannot be opened
        </Message>,

        {
          placement: 'bottomEnd',
        },
      )

      return
    }

    impersonateUser(agent.id)

    onClose?.()
  }

  /* =========================================
     Loading
  ========================================= */

  const agentsLoading = isUsersLoading || isUsersFetching

  return (
    <div className="container mx-auto max-w-7xl p-5">
      {/* =====================================
          Header
      ===================================== */}

      <div className="mb-3 flex items-center justify-between">
        <Link to="/">
          <Button appearance="subtle" startIcon={<Icon as={IoMdArrowBack} />}>
            Back to Dashboard
          </Button>
        </Link>

        <Heading level={4}>Profile</Heading>
      </div>

      <Divider />

      {/* =====================================
          Profile Overview
      ===================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* =================================
            Profile Card
        ================================= */}

        <Panel bordered className="md:col-span-1">
          <div className="flex h-full flex-col items-center">
            <div className="text-center">
              <Heading level={5}>
                {isMeLoading ? 'Loading...' : profileValue.fullName || '-'}
              </Heading>

              <div className="mt-1 text-sm text-[var(--rs-text-secondary)]">
                {profileValue.email || '-'}
              </div>

              {user?.role && (
                <div className="mt-3 flex justify-center">
                  <Tag color={user.role === 'ADMIN' ? 'blue' : 'green'}>{user.role}</Tag>
                </div>
              )}
            </div>

            <div className="mt-5">
              <Button
                startIcon={<Icon as={FaUserEdit} />}
                appearance="primary"
                onClick={handleEditProfileOpen}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </Panel>

        {/* =================================
            Profile Details
        ================================= */}

        <Panel bordered className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            {/* Full Name */}

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Full Name</div>

              <div className="mt-1 text-base">{profileValue.fullName || '-'}</div>
            </div>

            {/* Email */}

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Email</div>

              <div className="mt-1 text-base">{profileValue.email || '-'}</div>
            </div>

            {/* Phone */}

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Phone</div>

              <div className="mt-1 text-base">{profileValue.phone || '-'}</div>
            </div>

            {/* Role */}

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Role</div>

              <div className="mt-1">
                <Tag color={user?.role === 'ADMIN' ? 'blue' : 'green'}>{user?.role || 'AGENT'}</Tag>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* =====================================
          Agent Accounts
          ADMIN ONLY
      ===================================== */}

      {user?.role === 'ADMIN' && (
        <Panel
          bordered
          className="mt-5"
          header={
            <div className="flex items-center justify-between">
              <Heading level={4}>Agent Accounts</Heading>

              <Button
                startIcon={<Icon as={IoMdAdd} />}
                appearance="primary"
                onClick={handleCreateAgentOpen}
              >
                Create Agent
              </Button>
            </div>
          }
        >
          {/* =====================================
              Agent Table
          ===================================== */}

          <Table autoHeight bordered cellBordered data={agents} rowKey="id" loading={agentsLoading}>
            {/* Full Name */}

            <Column flexGrow={1} minWidth={180} fixed>
              <HeaderCell>Full Name</HeaderCell>

              <Cell dataKey="fullName" />
            </Column>

            {/* Email */}

            <Column flexGrow={1} minWidth={220}>
              <HeaderCell>Email</HeaderCell>

              <Cell dataKey="email" />
            </Column>

            {/* Mobile */}

            <Column width={150}>
              <HeaderCell>Mobile</HeaderCell>

              <Cell>{(rowData: User) => rowData.phone || 'N/A'}</Cell>
            </Column>

            {/* Role */}

            <Column width={110} align="center">
              <HeaderCell>Role</HeaderCell>

              <Cell>{(rowData: User) => <Tag color="green">{rowData.role}</Tag>}</Cell>
            </Column>

            {/* Status */}

            <Column width={110} align="center">
              <HeaderCell>Status</HeaderCell>

              <Cell>
                {(rowData: User) => (
                  <Tag color={rowData.isActive ? 'green' : 'red'}>
                    {rowData.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                )}
              </Cell>
            </Column>

            {/* =====================================
                Action
            ===================================== */}

            <Column width={90} fixed="right" align="center">
              <HeaderCell>Action</HeaderCell>

              <Cell verticalAlign="middle">
                {(rowData: User) => (
                  <Whisper
                    placement="bottomEnd"
                    trigger="click"
                    speaker={(
                      { className, onClose, ...props },

                      ref,
                    ) => (
                      <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                        <div className="px-2 py-2">
                          <div className="flex flex-col items-start gap-2">
                            {/* =================================
                                Edit
                            ================================= */}

                            <IconButton
                              icon={<Icon as={FaUserEdit} />}
                              appearance="primary"
                              color="blue"
                              size="sm"
                              aria-label="Edit agent"
                              onClick={() => {
                                handleEditAgentOpen(rowData)

                                onClose?.()
                              }}
                            >
                              Edit
                            </IconButton>

                            {/* =================================
                                Enable / Disable
                            ================================= */}

                            <IconButton
                              icon={
                                <Icon
                                  as={rowData.isActive ? IoMdRemoveCircle : IoMdCheckmarkCircle}
                                />
                              }
                              appearance="primary"
                              color={rowData.isActive ? 'red' : 'green'}
                              size="sm"
                              loading={updateUserMutation.isPending}
                              aria-label={rowData.isActive ? 'Disable agent' : 'Enable agent'}
                              onClick={() => {
                                handleToggleAgentStatus(rowData)

                                onClose?.()
                              }}
                            >
                              {rowData.isActive ? 'Disable' : 'Enable'}
                            </IconButton>

                            {/* =================================
                                Login As Agent
                            ================================= */}

                            <IconButton
                              appearance="primary"
                              icon={<Icon as={MdOutlineFlightTakeoff} />}
                              color="violet"
                              size="sm"
                              loading={isImpersonating}
                              disabled={isImpersonating || !rowData.isActive}
                              aria-label="Login as agent"
                              onClick={() =>
                                handleLoginAsAgent(
                                  rowData,

                                  onClose,
                                )
                              }
                            >
                              Login as Agent
                            </IconButton>

                            {/* =================================
                                Reset Password
                            ================================= */}

                            <IconButton
                              icon={<Icon as={IoMdKey} />}
                              appearance="primary"
                              color="orange"
                              size="sm"
                              aria-label="Reset agent password"
                              onClick={() => {
                                handleResetPasswordOpen(rowData)

                                onClose?.()
                              }}
                            >
                              Reset Password
                            </IconButton>
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
              Empty State
          ===================================== */}

          {!agentsLoading && agents.length === 0 && (
            <div className="py-10 text-center">
              <div className="font-medium">No agent account found</div>

              <div className="mt-1 text-sm text-[var(--rs-text-secondary)]">
                Create your first agent account.
              </div>
            </div>
          )}
        </Panel>
      )}

      {/* =====================================
          Edit Profile Modal
      ===================================== */}

      <Modal open={editProfileOpen} onClose={handleEditProfileClose} size="sm" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={profileFormRef}
            model={profileModel}
            formValue={profileValue}
            onChange={(value) => setProfileValue(value as ProfileFormValue)}
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4">
              {/* Full Name */}

              <Form.Stack fluid>
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name</Form.Label>

                  <Form.Control
                    name="fullName"
                    disabled={updateProfileMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* Email */}

              <Form.Stack fluid>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    name="email"
                    type="email"
                    disabled={updateProfileMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* Phone */}

              <Form.Stack fluid>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>

                  <Form.Control
                    name="phone"
                    type="tel"
                    disabled={updateProfileMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* =================================
                  Password Optional
              ================================= */}

              <Form.Stack fluid className="mb-2">
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    name="password"
                    accepter={PasswordInput}
                    autoComplete="new-password"
                    disabled={updateProfileMutation.isPending}
                    errorPlacement="bottomEnd"
                    placeholder="(optional)"
                  />
                </Form.Group>
              </Form.Stack>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="default"
            disabled={updateProfileMutation.isPending}
            onClick={handleEditProfileClose}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            loading={updateProfileMutation.isPending}
            disabled={updateProfileMutation.isPending}
            onClick={handleProfileSubmit}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================
          Create Agent Modal
      ===================================== */}

      <Modal open={createAgentOpen} onClose={handleCreateAgentClose} size="sm" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Create Agent Account</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={createAgentFormRef}
            model={createAgentModel}
            formValue={newAgent}
            onChange={(value) => setNewAgent(value as CreateAgentFormValue)}
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4">
              {/* Full Name */}

              <Form.Stack fluid>
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name</Form.Label>

                  <Form.Control
                    name="fullName"
                    disabled={createUserMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* Email */}

              <Form.Stack fluid>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>

                  <Form.Control
                    name="email"
                    type="email"
                    autoComplete="off"
                    disabled={createUserMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* Mobile */}

              <Form.Stack fluid>
                <Form.Group controlId="phone">
                  <Form.Label>Mobile</Form.Label>

                  <Form.Control
                    name="phone"
                    type="tel"
                    disabled={createUserMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* Password */}

              <Form.Stack fluid className="mb-2">
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>

                  <Form.Control
                    name="password"
                    accepter={PasswordInput}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    disabled={createUserMutation.isPending}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              {/* Role Info */}

              <div className="rounded-md border border-dashed p-3">
                <div className="text-xs text-[var(--rs-text-secondary)]">Account Role</div>

                <div className="mt-2">
                  <Tag color="green">AGENT</Tag>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="default"
            disabled={createUserMutation.isPending}
            onClick={handleCreateAgentClose}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdAdd} />}
            appearance="primary"
            loading={createUserMutation.isPending}
            disabled={createUserMutation.isPending}
            onClick={handleCreateAgent}
          >
            Create Agent
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================
          Edit Agent Modal
      ===================================== */}

      <Modal open={editAgentOpen} onClose={handleEditAgentClose} size="sm" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Agent</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {editingAgent && (
            <Form
              ref={editAgentFormRef}
              model={editAgentModel}
              formValue={editingAgent}
              onChange={(value) => setEditingAgent(value as EditAgentFormValue)}
            >
              <div className="grid grid-cols-1 gap-x-3 gap-y-4">
                {/* Full Name */}

                <Form.Stack fluid>
                  <Form.Group controlId="fullName">
                    <Form.Label>Full Name</Form.Label>

                    <Form.Control
                      name="fullName"
                      disabled={updateUserMutation.isPending}
                      errorPlacement="bottomEnd"
                    />
                  </Form.Group>
                </Form.Stack>

                {/* Email */}

                <Form.Stack fluid>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>

                    <Form.Control
                      name="email"
                      type="email"
                      disabled={updateUserMutation.isPending}
                      errorPlacement="bottomEnd"
                    />
                  </Form.Group>
                </Form.Stack>

                {/* Mobile */}

                <Form.Stack fluid className="mb-2">
                  <Form.Group controlId="phone">
                    <Form.Label>Mobile</Form.Label>

                    <Form.Control
                      name="phone"
                      type="tel"
                      disabled={updateUserMutation.isPending}
                      errorPlacement="bottomEnd"
                    />
                  </Form.Group>
                </Form.Stack>

                {/* Role */}

                <div className="rounded-md border border-dashed p-3">
                  <div className="text-xs text-[var(--rs-text-secondary)]">Account Role</div>

                  <div className="mt-2">
                    <Tag color="green">AGENT</Tag>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="default"
            disabled={updateUserMutation.isPending}
            onClick={handleEditAgentClose}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            loading={updateUserMutation.isPending}
            disabled={updateUserMutation.isPending}
            onClick={handleUpdateAgent}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* =====================================
          Reset Agent Password Modal
      ===================================== */}

      <Modal
        open={resetPasswordOpen}
        onClose={handleResetPasswordClose}
        size="xs"
        backdrop="static"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Reset Agent Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedAgent && (
            <>
              {/* Agent Information */}

              <div className="mb-5 rounded-md border border-dashed p-3">
                <div className="font-medium">{selectedAgent.fullName}</div>

                <div className="mt-1 text-sm text-[var(--rs-text-secondary)]">
                  {selectedAgent.email}
                </div>
              </div>

              <Form fluid>
                {/* New Password */}

                <Form.Group>
                  <Form.Label>New Password</Form.Label>

                  <PasswordInput
                    value={resetPassword.newPassword}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    disabled={updateUserMutation.isPending}
                    onChange={(value) =>
                      setResetPassword((prev) => ({
                        ...prev,

                        newPassword: value,
                      }))
                    }
                  />
                </Form.Group>

                {/* Confirm Password */}

                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>

                  <PasswordInput
                    value={resetPassword.confirmPassword}
                    autoComplete="new-password"
                    placeholder="Enter password again"
                    disabled={updateUserMutation.isPending}
                    onChange={(value) =>
                      setResetPassword((prev) => ({
                        ...prev,

                        confirmPassword: value,
                      }))
                    }
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="default"
            disabled={updateUserMutation.isPending}
            onClick={handleResetPasswordClose}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            loading={updateUserMutation.isPending}
            disabled={updateUserMutation.isPending}
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Page
