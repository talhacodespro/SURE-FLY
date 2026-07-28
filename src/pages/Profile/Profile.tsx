import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Avatar,
  Button,
  Divider,
  Form,
  Heading,
  Panel,
  Schema,
  Textarea,
  DateInput,
  StringType,
  DateType,
  Modal,
  Uploader,
  toaster,
  Message,
  Table,
  SelectPicker,
  IconButton,
  Tag,
  Whisper,
  Popover,
  PasswordInput,
} from 'rsuite'

import { Link } from 'react-router'
import { Icon } from '@rsuite/icons'
import {
  IoMdArrowBack,
  IoMdClose,
  IoMdSave,
  IoMdAdd,
  IoMdTrash,
  IoMdKey,
  IoMdRemoveCircle,
  IoMdCheckmarkCircle,
} from 'react-icons/io'
import { RxAvatar } from 'react-icons/rx'
import type { FormInstance } from 'rsuite'
import { FaUserEdit } from 'react-icons/fa'
import { CgMore } from 'react-icons/cg'
import { IoKeySharp } from 'react-icons/io5'
import {
  useMe,
  useUpdateUser,
  // useCreateUser,
  // useUpdateUserRole,
  // useUpdateUserStatus,
  // useResetUserPassword,
  // useDeleteUser,
  // useChangePassword,
} from '@/hooks/useUser'
import { uploadAvatar } from '@/lib/uploadAvatar'

const { Column, HeaderCell, Cell } = Table

type UserRole = 'USER' | 'ADMIN'

type User = {
  id: number
  fullName: string
  email: string
  phone?: string | null
  avatar?: string | null
  dob?: string | null
  address?: string | null
  role: UserRole
  isActive: boolean
}

const initialProfile = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dob: null as Date | null,
  avatar: '',
}

const initialNewUser = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  dob: null as Date | null,
  role: 'USER' as UserRole,
  password: '',
  confirmPassword: '',
}

const initialPasswordValue = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const Page = () => {
  const { data: meRes } = useMe()
  const user = meRes?.data
  // const { data: usersRes, isLoading: isUsersLoading } = useUsers()

  const updateUserMutation = useUpdateUser()
  // const changePasswordMutation = useChangePassword()
  // const createUserMutation = useCreateUser()
  // const updateRoleMutation = useUpdateUserRole()
  // const updateStatusMutation = useUpdateUserStatus()
  // const resetPasswordMutation = useResetUserPassword()
  // const deleteUserMutation = useDeleteUser()

  // const users: User[] = usersRes?.data ?? []

  const formRef = useRef<FormInstance>(null)
  const passwordFormRef = useRef<FormInstance>(null)
  const createUserFormRef = useRef<FormInstance>(null)
  const editUserFormRef = useRef<FormInstance>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [formValue, setFormValue] = useState(initialProfile)
  const [fileInfo, setFileInfo] = useState<string | null>(null)

  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordFormValue, setPasswordFormValue] = useState(initialPasswordValue)

  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [newUser, setNewUser] = useState(initialNewUser)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<{
    id: number
    fullName: string
    email: string
    role: UserRole
  } | null>(null)

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [resetPassword, setResetPassword] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!user) return

    setFormValue({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      avatar: user.avatar || '',
      dob: user.dob ? new Date(user.dob) : null,
    })
  }, [meRes, user])

  const profileModel = useMemo(() => {
    return Schema.Model({
      fullName: StringType().isRequired('Full name is required.'),
      email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),
      phone: StringType(),
      address: StringType(),
      dob: DateType(),
    })
  }, [])

  const passwordModel = useMemo(() => {
    return Schema.Model({
      currentPassword: StringType()
        .isRequired('Current password is required.')
        .addRule((value) => value.length >= 6, 'Password must be at least 6 characters.'),
      newPassword: StringType()
        .isRequired('New password is required.')
        .addRule((value) => value.length >= 6, 'Password must be at least 6 characters.'),
      confirmPassword: StringType()
        .isRequired('Confirm password is required.')
        .addRule((value, data) => value === data.newPassword, "Password doesn't match."),
    })
  }, [])

  const userModel = useMemo(() => {
    return Schema.Model({
      fullName: StringType().isRequired('Full name is required.'),
      email: StringType().isEmail('Invalid email').isRequired('Email is required.'),
      phone: StringType().isRequired('Phone is required.'),
      address: StringType().isRequired('Address is required.'),
      dob: DateType(),
      role: StringType().isRequired('Role is required.'),
      password: StringType()
        .isRequired('Password is required.')
        .addRule((value) => value.length >= 6, 'Password must be at least 6 characters.'),
      confirmPassword: StringType()
        .isRequired('Confirm password is required.')
        .addRule((value, data) => value === data.password, "Password doesn't match."),
    })
  }, [])

  const editUserModel = useMemo(() => {
    return Schema.Model({
      role: StringType().isRequired('Role is required.'),
    })
  }, [])

  const previewFile = (file: File | Blob, callback: (value: string) => void) => {
    const reader = new FileReader()

    reader.onloadend = () => {
      callback(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return

    updateUserMutation.mutate(
      {
        id: meRes?.data?.id || 0,
        payload: {
          fullName: formValue.fullName.trim(),
          email: formValue.email.trim(),
          phone: formValue.phone.trim(),
          address: formValue.address.trim(),
          avatar: formValue.avatar,
          dob: formValue.dob,
        },
      },
      {
        onSuccess: () => {
          setEditOpen(false)

          toaster.push(
            <Message showIcon type="success">
              Profile updated successfully
            </Message>,
            { placement: 'bottomEnd' },
          )
        },
      },
    )
  }

  const handlePasswordSubmit = () => {
    const valid = passwordFormRef.current?.check()
    if (!valid) return

    // changePasswordMutation.mutate(
    //   {
    //     currentPassword: passwordFormValue.currentPassword,
    //     newPassword: passwordFormValue.newPassword,
    //   },
    //   {
    //     onSuccess: () => {
    //       setPasswordOpen(false)
    //       setPasswordFormValue(initialPasswordValue)

    //       toaster.push(
    //         <Message showIcon type="success">
    //           Password changed successfully
    //         </Message>,
    //         { placement: 'bottomEnd' },
    //       )
    //     },
    //   },
    // )
  }

  const handleCreateUser = () => {
    if (!createUserFormRef.current?.check()) return

    // createUserMutation.mutate(
    //   {
    //     fullName: newUser.name.trim(),
    //     email: newUser.email.trim(),
    //     phone: newUser.mobile.trim(),
    //     address: newUser.address.trim(),
    //     dob: newUser.dob,
    //     role: newUser.role,
    //     password: newUser.password,
    //   },
    //   {
    //     onSuccess: () => {
    //       setCreateUserOpen(false)
    //       setNewUser(initialNewUser)

    //       toaster.push(
    //         <Message type="success" showIcon>
    //           User created successfully
    //         </Message>,
    //         { placement: 'bottomEnd' },
    //       )
    //     },
    //   },
    // )
  }

  const handleEditUserClick = (user: User) => {
    setEditingUser({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })

    setEditUserOpen(true)
  }

  const handleUpdateUser = () => {
    if (!editUserFormRef.current?.check() || !editingUser) return

    // updateRoleMutation.mutate(
    //   {
    //     id: editingUser.id,
    //     role: editingUser.role,
    //   },
    //   {
    //     onSuccess: () => {
    //       setEditUserOpen(false)

    //       toaster.push(
    //         <Message type="success" showIcon>
    //           User role updated successfully
    //         </Message>,
    //         { placement: 'bottomEnd' },
    //       )
    //     },
    //   },
    // )
  }

  // const handleDeleteUser = (id: number) => {
  //   // deleteUserMutation.mutate(id, {
  //   //   onSuccess: () => {
  //   //     toaster.push(
  //   //       <Message type="success" showIcon>
  //   //         User deleted successfully
  //   //       </Message>,
  //   //       { placement: 'bottomEnd' },
  //   //     )
  //   //   },
  //   // })
  // }

  // const handleToggleStatus = (user: User) => {
  //   // updateStatusMutation.mutate(
  //   //   {
  //   //     id: user.id,
  //   //     isActive: !user.isActive,
  //   //   },
  //   //   {
  //   //     onSuccess: () => {
  //   //       toaster.push(
  //   //         <Message type="success" showIcon>
  //   //           User status updated successfully
  //   //         </Message>,
  //   //         { placement: 'bottomEnd' },
  //   //       )
  //   //     },
  //   //   },
  //   // )
  // }

  const handleResetPassword = () => {
    if (!selectedUserId) return

    if (resetPassword.newPassword.length < 6) {
      toaster.push(
        <Message type="error" showIcon>
          Password must be at least 6 characters
        </Message>,
        { placement: 'bottomEnd' },
      )
      return
    }

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      toaster.push(
        <Message type="error" showIcon>
          Password doesn't match
        </Message>,
        { placement: 'bottomEnd' },
      )
      return
    }

    // resetPasswordMutation.mutate(
    //   {
    //     id: selectedUserId,
    //     newPassword: resetPassword.newPassword,
    //   },
    //   {
    //     onSuccess: () => {
    //       setResetPasswordOpen(false)
    //       setSelectedUserId(null)
    //       setResetPassword({ newPassword: '', confirmPassword: '' })

    //       toaster.push(
    //         <Message type="success" showIcon>
    //           Password reset successfully
    //         </Message>,
    //         { placement: 'bottomEnd' },
    //       )
    //     },
    //   },
    // )
  }
  return (
    <div className="container mx-auto max-w-7xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <Link to="/">
          <Button appearance="subtle" startIcon={<Icon as={IoMdArrowBack} />}>
            Back to Dashboard
          </Button>
        </Link>

        <Heading level={4}>Profile</Heading>
      </div>

      <Divider />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Panel bordered className="md:col-span-1">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              size="lg"
              src={formValue.avatar || undefined}
              // className="bg-primary/10 text-primary"
            >
              {formValue.fullName?.charAt(0) || 'S'}
            </Avatar>

            <div className="text-center">
              <div className="text-lg font-semibold">{formValue.fullName || '-'}</div>
              <div className="text-sm text-[var(--rs-text-secondary)]">
                {formValue.email || '-'}
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <Button
                startIcon={<Icon as={FaUserEdit} />}
                appearance="primary"
                onClick={() => setEditOpen(true)}
              >
                Edit Profile
              </Button>

              <Button
                startIcon={<Icon as={IoKeySharp} />}
                appearance="default"
                onClick={() => setPasswordOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Panel>

        <Panel bordered className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Full Name</div>
              <div className="text-base">{formValue.fullName || '-'}</div>
            </div>

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Email</div>
              <div className="text-base">{formValue.email || '-'}</div>
            </div>

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Phone</div>
              <div className="text-base">{formValue.phone || '-'}</div>
            </div>

            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Date of Birth</div>
              <div className="text-base">
                {formValue.dob ? formValue.dob.toLocaleDateString() : '-'}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="text-sm text-[var(--rs-text-secondary)]">Address</div>
              <div className="text-base">{formValue.address || '-'}</div>
            </div>
          </div>
        </Panel>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={formRef}
            model={profileModel}
            formValue={formValue}
            onChange={(val) => setFormValue(val as typeof formValue)}
          >
            <div className="mx-2 grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
              <Form.Stack fluid>
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control name="fullName" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="dob">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    name="dob"
                    accepter={DateInput}
                    format="dd/MMM/yyyy"
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid className="md:col-span-2">
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    name="address"
                    accepter={Textarea}
                    rows={2}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid className="md:col-span-2">
                <Form.Group>
                  <Form.Label>Avatar</Form.Label>

                  <Uploader
                    fileListVisible={false}
                    listType="picture"
                    accept="image/*"
                    autoUpload={false}
                    action="#"
                    width={500}
                    height={500}
                    onChange={async (fileList) => {
                      const latestFile = fileList[fileList.length - 1]

                      if (!latestFile?.blobFile) return

                      try {
                        // 1. First local preview show korbe
                        previewFile(latestFile.blobFile, (value) => {
                          setFileInfo(value)
                        })

                        // 2. Tarpor Supabase e upload korbe
                        const avatar = await uploadAvatar(latestFile.blobFile, meRes?.data?.id)

                        // 3. Upload er por real URL formValue te set korbe
                        setFormValue((prev) => ({
                          ...prev,
                          avatar,
                        }))

                        toaster.push(
                          <Message type="success" showIcon>
                            Avatar uploaded successfully
                          </Message>,
                          { placement: 'bottomEnd' },
                        )
                      } catch (error) {
                        toaster.push(
                          <Message type="error" showIcon>
                            {error instanceof Error ? error.message : 'Avatar upload failed'}
                          </Message>,
                          { placement: 'bottomEnd' },
                        )
                      }
                    }}
                  >
                    <button
                      type="button"
                      style={{ width: '160px', height: '160px' }}
                      className="flex cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed bg-transparent"
                    >
                      {fileInfo || formValue.avatar ? (
                        <img
                          src={fileInfo || formValue.avatar}
                          alt="Avatar Preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <RxAvatar size={40} color="var(--rs-gray-500)" />
                      )}
                    </button>
                  </Uploader>
                </Form.Group>
              </Form.Stack>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="default"
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            onClick={handleSubmit}
            loading={updateUserMutation.isPending}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={passwordOpen} onClose={() => setPasswordOpen(false)} size="xs" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={passwordFormRef}
            model={passwordModel}
            formValue={passwordFormValue}
            onChange={(val) => setPasswordFormValue(val as typeof passwordFormValue)}
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4">
              <Form.Stack fluid>
                <Form.Group controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    name="currentPassword"
                    type="password"
                    accepter={PasswordInput}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    name="newPassword"
                    type="password"
                    accepter={PasswordInput}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid className="mb-4">
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    accepter={PasswordInput}
                    errorPlacement="bottomEnd"
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
            onClick={() => setPasswordOpen(false)}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            onClick={handlePasswordSubmit}
            // loading={changePasswordMutation.isPending}
          >
            Save Password
          </Button>
        </Modal.Footer>
      </Modal>

      {user?.role === 'ADMIN' && (
        <Panel
          header={
            <div className="flex items-center justify-between">
              <Heading level={4}>User Role</Heading>

              <Button
                startIcon={<Icon as={IoMdAdd} />}
                appearance="primary"
                onClick={() => setCreateUserOpen(true)}
              >
                Create User
              </Button>
            </div>
          }
          bordered
          className="mt-5"
        >
          <Table autoHeight data={[]} rowKey="id">
            <Column flexGrow={1} fixed>
              <HeaderCell>Name</HeaderCell>
              <Cell dataKey="fullName" />
            </Column>

            <Column flexGrow={1}>
              <HeaderCell>Email</HeaderCell>
              <Cell dataKey="email" />
            </Column>

            <Column width={120}>
              <HeaderCell>Mobile</HeaderCell>
              <Cell dataKey="phone" />
            </Column>

            <Column width={120}>
              <HeaderCell>Date of Birth</HeaderCell>
              <Cell>
                {(rowData: User) => (
                  <span>{rowData.dob ? new Date(rowData.dob).toLocaleDateString() : '-'}</span>
                )}
              </Cell>
            </Column>

            <Column flexGrow={2}>
              <HeaderCell>Address</HeaderCell>
              <Cell dataKey="address" />
            </Column>

            <Column width={100}>
              <HeaderCell>Role</HeaderCell>
              <Cell>
                {(rowData: User) => (
                  <Tag color={rowData.role === 'ADMIN' ? 'blue' : 'green'}>{rowData.role}</Tag>
                )}
              </Cell>
            </Column>

            <Column width={100}>
              <HeaderCell>Status</HeaderCell>
              <Cell>
                {(rowData: User) => (
                  <Tag color={rowData.isActive ? 'green' : 'red'}>
                    {rowData.isActive ? 'Active' : 'Inactive'}
                  </Tag>
                )}
              </Cell>
            </Column>

            <Column width={100} align="center">
              <HeaderCell>Action</HeaderCell>

              <Cell>
                {(rowData: User) => (
                  <Whisper
                    placement="bottomEnd"
                    trigger="click"
                    speaker={({ className, onClose, ...props }, ref) => {
                      return (
                        <Popover ref={ref} full {...props} className={`${className} shadow-md`}>
                          <div className="px-2 pt-2 pb-2">
                            <div className="flex flex-col items-start gap-y-2">
                              <IconButton
                                onClick={() => {
                                  handleEditUserClick(rowData)
                                  onClose?.()
                                }}
                                icon={<Icon as={FaUserEdit} />}
                                color="blue"
                                size="sm"
                                appearance="primary"
                              >
                                Edit
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  // handleToggleStatus(rowData)
                                  onClose?.()
                                }}
                                icon={
                                  <Icon
                                    as={rowData.isActive ? IoMdRemoveCircle : IoMdCheckmarkCircle}
                                  />
                                }
                                color={rowData.isActive ? 'red' : 'green'}
                                size="sm"
                                appearance="primary"
                              >
                                {rowData.isActive ? 'Disable' : 'Enable'}
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  setSelectedUserId(rowData.id)
                                  setResetPassword({ newPassword: '', confirmPassword: '' })
                                  setResetPasswordOpen(true)
                                  onClose?.()
                                }}
                                icon={<Icon as={IoMdKey} />}
                                color="orange"
                                size="sm"
                                appearance="primary"
                              >
                                Reset Password
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  // handleDeleteUser(rowData.id)
                                  onClose?.()
                                }}
                                icon={<Icon as={IoMdTrash} />}
                                color="red"
                                size="sm"
                                appearance="primary"
                                // loading={deleteUserMutation.isPending}
                              >
                                Delete
                              </IconButton>
                            </div>
                          </div>
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
        </Panel>
      )}
      <Modal
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        size="sm"
        backdrop="static"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={createUserFormRef}
            model={userModel}
            formValue={newUser}
            onChange={(val) => setNewUser(val as typeof newUser)}
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4">
              <Form.Stack fluid>
                <Form.Group controlId="newName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="newEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="newMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control name="mobile" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="newAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control name="address" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="newRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    cleanable={false}
                    name="role"
                    accepter={SelectPicker}
                    data={[
                      { label: 'Admin', value: 'ADMIN' },
                      { label: 'User', value: 'USER' },
                    ]}
                    searchable={false}
                    block
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="newPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    accepter={PasswordInput}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid className="mb-2">
                <Form.Group controlId="newConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    accepter={PasswordInput}
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            onClick={() => setCreateUserOpen(false)}
            appearance="default"
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdAdd} />}
            onClick={handleCreateUser}
            appearance="primary"
            // loading={createUserMutation.isPending}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={editUserOpen} onClose={() => setEditUserOpen(false)} size="xs" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            ref={editUserFormRef}
            model={editUserModel}
            formValue={editingUser || { role: 'USER' }}
            onChange={(val) =>
              setEditingUser((prev) => {
                if (!prev) return null

                return {
                  ...prev,
                  role: (val as { role: UserRole }).role,
                }
              })
            }
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4">
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="fullName" readOnly />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" readOnly />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    cleanable={false}
                    name="role"
                    accepter={SelectPicker}
                    data={[
                      { label: 'Admin', value: 'ADMIN' },
                      { label: 'User', value: 'USER' },
                    ]}
                    searchable={false}
                    block
                  />
                </Form.Group>
              </Form.Stack>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            onClick={() => setEditUserOpen(false)}
            appearance="default"
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            onClick={handleUpdateUser}
            appearance="primary"
            // loading={updateRoleMutation.isPending}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        open={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        size="xs"
        backdrop="static"
      >
        <Modal.Header closeButton={false}>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                name="newPassword"
                type="password"
                accepter={PasswordInput}
                value={resetPassword.newPassword}
                onChange={(val) =>
                  setResetPassword((prev) => ({ ...prev, newPassword: val as string }))
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                accepter={PasswordInput}
                value={resetPassword.confirmPassword}
                onChange={(val) =>
                  setResetPassword((prev) => ({ ...prev, confirmPassword: val as string }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            startIcon={<Icon as={IoMdClose} />}
            onClick={() => setResetPasswordOpen(false)}
            appearance="default"
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            onClick={handleResetPassword}
            appearance="primary"
            // loading={resetPasswordMutation.isPending}
          >
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Page
