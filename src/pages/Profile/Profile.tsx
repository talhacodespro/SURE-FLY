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
import { useMe } from '@/hooks/useUser'

const Page = () => {
  const { data: me } = useMe()

  // --- Profile State ---
  const [profile, setProfile] = useState({
    name: 'User Name',
    email: 'user@example.com',
    mobile: '01300000000',
    address: '',
    dob: null as Date | null,
    avatarUrl: '',
  })

  const [editOpen, setEditOpen] = useState(false)
  const [formValue, setFormValue] = useState({ ...profile })
  const [fileInfo, setFileInfo] = useState<string | null>(null)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [passwordFormValue, setPasswordFormValue] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const user = me?.data
    if (user) {
      const dob = user.dob ? new Date(user.dob) : null
      setProfile((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
        mobile: user.phone || prev.mobile,
        address: user.address || prev.address,
        avatarUrl: user.avatar || prev.avatarUrl,
        dob,
      }))
      setFormValue((prev) => ({
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
        mobile: user.phone || prev.mobile,
        address: user.address || prev.address,
        avatarUrl: user.avatar || prev.avatarUrl,
        dob,
      }))
    }
  }, [me])

  // --- Profile Validation Schema ---
  const model = useMemo(() => {
    return Schema.Model({
      name: StringType().isRequired('Name is required.'),
      email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),
      mobile: StringType().isRequired('Mobile is required.'),
      address: StringType().isRequired('Address is required.'),
      dob: DateType(),
    })
  }, [])

  // --- File Preview Handler ---
  const previewFile = (file: File | Blob, callback: (value: string) => void) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      callback(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const formRef = useRef<FormInstance>(null)
  const passwordFormRef = useRef<FormInstance>(null)

  // --- Update Profile Handler ---
  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return
    setProfile(formValue)
    setEditOpen(false)
    toaster.push(
      <Message showIcon type="success">
        Changes saved successfully
      </Message>,
      { placement: 'bottomEnd' },
    )
  }

  // --- Password Validation Schema ---
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

  // --- Change Password Handler ---
  const handlePasswordSubmit = () => {
    const valid = passwordFormRef.current?.check()
    if (!valid) return
    setProfile((prev) => ({ ...prev }))
    setPasswordOpen(false)
    setPasswordFormValue({ currentPassword: '', newPassword: '', confirmPassword: '' })
    toaster.push(
      <Message showIcon type="success">
        Password changed successfully
      </Message>,
      { placement: 'bottomEnd' },
    )
  }

  // --- User Management State ---
  const [userList, setUserList] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      mobile: '01700000000',
      dob: new Date('1990-01-01'),
      address: 'Dhaka, Bangladesh',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      mobile: '01800000000',
      dob: new Date('1995-05-05'),
      address: 'Chittagong, Bangladesh',
      role: 'User',
      status: 'Active',
    },
  ])
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    dob: null as Date | null,
    role: 'User',
    password: '',
    confirmPassword: '',
  })
  const createUserFormRef = useRef<FormInstance>(null)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<{
    id: number
    name: string
    email: string
    role: string
  } | null>(null)
  const editUserFormRef = useRef<FormInstance>(null)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [resetPassword, setResetPassword] = useState({ newPassword: '', confirmPassword: '' })

  // --- Create User Validation Schema ---
  const userModel = useMemo(() => {
    return Schema.Model({
      name: StringType().isRequired('Name is required.'),
      email: StringType().isEmail('Invalid email').isRequired('Email is required.'),
      mobile: StringType().isRequired('Mobile is required.'),
      address: StringType().isRequired('Address is required.'),
      dob: DateType().isRequired('Date of Birth is required.'),
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

  // --- Create User Handler ---
  const handleCreateUser = () => {
    if (!createUserFormRef.current?.check()) return
    const user = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      address: newUser.address,
      dob: newUser.dob as Date,
      role: newUser.role,
      status: 'Active',
    }
    setUserList((prev) => [...prev, user])
    setCreateUserOpen(false)
    setNewUser({
      name: '',
      email: '',
      mobile: '',
      address: '',
      dob: null,
      role: 'User',
      password: '',
      confirmPassword: '',
    })
    toaster.push(<Message type="success">User created successfully</Message>, {
      placement: 'bottomEnd',
    })
  }
  const handleEditUserClick = (user: { id: number; name: string; email: string; role: string }) => {
    setEditingUser({ id: user.id, name: user.name, email: user.email, role: user.role })
    setEditUserOpen(true)
  }
  const handleUpdateUser = () => {
    if (!editUserFormRef.current?.check() || !editingUser) return
    setUserList((prev) =>
      prev.map((u) => (u.id === editingUser.id ? { ...u, role: editingUser.role } : u)),
    )
    setEditUserOpen(false)
    toaster.push(<Message type="success">User updated successfully</Message>, {
      placement: 'bottomEnd',
    })
  }

  // --- Delete User Handler ---
  const handleDeleteUser = (id: number) => {
    setUserList((prev) => prev.filter((u) => u.id !== id))
    toaster.push(<Message type="info">User deleted</Message>, { placement: 'bottomEnd' })
  }

  // --- Toggle User Status Handler ---
  const handleToggleStatus = (id: number) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Inactive' : 'Active'
          return { ...u, status: newStatus }
        }
        return u
      }),
    )
    toaster.push(<Message type="info">User status updated</Message>, { placement: 'bottomEnd' })
  }

  // --- Reset Password Logic (Admin) ---

  const { Column, HeaderCell, Cell } = Table

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

      {/* --- Profile Overview Section --- */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Profile Card Panel */}
        <Panel bordered className="md:col-span-1">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              circle
              size="lg"
              src={profile.avatarUrl || undefined}
              className="bg-primary/10 text-primary"
            >
              {profile.name?.charAt(0) || 'U'}
            </Avatar>
            <div className="text-center">
              <div className="text-lg font-semibold">{profile.name}</div>
              <div className="text-sm text-[var(--rs-text-secondary)]">{profile.email}</div>
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

        {/* Profile Details Panel */}
        <Panel bordered className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Name</div>
              <div className="text-base">{profile.name || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Email</div>
              <div className="text-base">{profile.email || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Mobile</div>
              <div className="text-base">{profile.mobile || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--rs-text-secondary)]">Date of Birth</div>
              <div className="text-base">
                {profile.dob ? profile.dob.toLocaleDateString() : '-'}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-[var(--rs-text-secondary)]">Address</div>
              <div className="text-base">{profile.address || '-'}</div>
            </div>
          </div>
        </Panel>
      </div>

      {/* --- Edit Profile Modal --- */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} size="md" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={formRef}
            model={model}
            formValue={formValue}
            onChange={(val) => setFormValue(val as typeof formValue)}
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control name="mobile" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control name="dob" accepter={DateInput} format="dd/MMM/yyyy" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid className="md:col-span-2">
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control name="address" accepter={Textarea} rows={2} />
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
                    onChange={(fileList) => {
                      if (fileList.length > 0) {
                        const latestFile = fileList[fileList.length - 1]
                        if (latestFile.blobFile) {
                          previewFile(latestFile.blobFile, (value) => {
                            setFileInfo(value)
                            setFormValue((prev) => ({ ...prev, avatarUrl: value }))
                          })
                        }
                      }
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        width: 150,
                        height: 150,
                        border: '1px dashed var(--rs-border-primary)',
                        borderRadius: 8,
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                      }}
                    >
                      {fileInfo || formValue.avatarUrl ? (
                        <img
                          src={fileInfo || formValue.avatarUrl}
                          style={{ width: '100%', height: '100%' }}
                          alt="Avatar"
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
          <Button startIcon={<Icon as={IoMdSave} />} appearance="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* --- Change Password Modal --- */}
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
                <Form.Group>
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control name="currentPassword" type="password" accepter={PasswordInput} />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control name="newPassword" type="password" accepter={PasswordInput} />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid className="mb-4">
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control name="confirmPassword" type="password" accepter={PasswordInput} />
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
          >
            Save Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- User Management Section --- */}
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
        <Table autoHeight data={userList}>
          <Column flexGrow={1} fixed>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>

          <Column flexGrow={1}>
            <HeaderCell>Email</HeaderCell>
            <Cell dataKey="email" />
          </Column>

          <Column width={120}>
            <HeaderCell>Mobile</HeaderCell>
            <Cell dataKey="mobile" />
          </Column>

          <Column width={120}>
            <HeaderCell>Date of Birth</HeaderCell>
            <Cell>
              {(rowData) => (
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
              {(rowData) => (
                <Tag color={rowData.role === 'Admin' ? 'blue' : 'green'}>{rowData.role}</Tag>
              )}
            </Cell>
          </Column>

          <Column width={100}>
            <HeaderCell>Status</HeaderCell>
            <Cell>
              {(rowData) => (
                <Tag color={rowData.status === 'Active' ? 'green' : 'red'}>
                  {rowData.status || 'Active'}
                </Tag>
              )}
            </Cell>
          </Column>

          <Column width={100} align="center">
            <HeaderCell>Action</HeaderCell>
            <Cell>
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
                                  handleEditUserClick({
                                    id: rowData.id as number,
                                    name: rowData.name as string,
                                    email: rowData.email as string,
                                    role: rowData.role as string,
                                  })
                                  if (onClose) onClose()
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
                                  handleToggleStatus(rowData.id as number)
                                  if (onClose) onClose()
                                }}
                                icon={
                                  <Icon
                                    as={
                                      rowData.status === 'Active'
                                        ? IoMdRemoveCircle
                                        : IoMdCheckmarkCircle
                                    }
                                  />
                                }
                                color={rowData.status === 'Active' ? 'red' : 'green'}
                                size="sm"
                                appearance="primary"
                              >
                                {rowData.status === 'Active' ? 'Disable' : 'Enable'}
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  setSelectedUserId(rowData.id as number)
                                  setResetPassword({ newPassword: '', confirmPassword: '' })
                                  setResetPasswordOpen(true)
                                  if (onClose) onClose()
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
                                  handleDeleteUser(rowData.id as number)
                                  if (onClose) onClose()
                                }}
                                icon={<Icon as={IoMdTrash} />}
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
      </Panel>

      {/* --- Create User Modal --- */}
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
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control name="email" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control name="mobile" />
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
                      { label: 'Admin', value: 'Admin' },
                      { label: 'User', value: 'User' },
                    ]}
                    searchable={false}
                    block
                  />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control name="password" type="password" accepter={PasswordInput} />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid className="mb-2">
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control name="confirmPassword" type="password" />
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
          <Button startIcon={<Icon as={IoMdAdd} />} onClick={handleCreateUser} appearance="primary">
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Edit User Modal --- */}
      <Modal open={editUserOpen} onClose={() => setEditUserOpen(false)} size="xs" backdrop="static">
        <Modal.Header closeButton={false}>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            ref={editUserFormRef}
            model={editUserModel}
            formValue={editingUser || { role: 'User' }}
            onChange={(val) =>
              setEditingUser((prev) => ({
                id: prev?.id || 0,
                name: prev?.name || '',
                email: prev?.email || '',
                role: (val as typeof editingUser)?.role || prev?.role || 'User',
              }))
            }
          >
            <div className="grid grid-cols-1 gap-x-3 gap-y-4">
              <Form.Stack fluid>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control name="name" readOnly />
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
                      { label: 'Admin', value: 'Admin' },
                      { label: 'User', value: 'User' },
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
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- Reset Password Modal (Admin) --- */}
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
                value={resetPassword.newPassword}
                onChange={(val) => setResetPassword((p) => ({ ...p, newPassword: val as string }))}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmPassword"
                type="password"
                value={resetPassword.confirmPassword}
                onChange={(val) =>
                  setResetPassword((p) => ({ ...p, confirmPassword: val as string }))
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
            onClick={() => {
              if (resetPassword.newPassword.length < 6) {
                toaster.push(
                  <Message type="error">Password must be at least 6 characters</Message>,
                  {
                    placement: 'bottomEnd',
                  },
                )
                return
              }
              if (resetPassword.newPassword !== resetPassword.confirmPassword) {
                toaster.push(<Message type="error">Password doesn't match</Message>, {
                  placement: 'bottomEnd',
                })
                return
              }
              setUserList((prev) =>
                prev.map((u) =>
                  u.id === selectedUserId ? { ...u, password: resetPassword.newPassword } : u,
                ),
              )
              setResetPasswordOpen(false)
              toaster.push(<Message type="success">Password reset successfully</Message>, {
                placement: 'bottomEnd',
              })
            }}
            appearance="primary"
          >
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Page
