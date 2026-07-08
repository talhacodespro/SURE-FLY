import { useCreatePaymentMethod, usePaymentMethods } from '@/hooks/useTransaction'
import { Icon, Trash } from '@rsuite/icons'
import { useState, useRef } from 'react'
import { CgMore } from 'react-icons/cg'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import {
  Button,
  Heading,
  Divider,
  Modal,
  Table,
  IconButton,
  Popover,
  Whisper,
  Form,
  NumberInput,
} from 'rsuite'
import type { FormInstance } from 'rsuite'
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

const { Column, HeaderCell, Cell } = Table

// ========== Form Validation Model ==========
const FormModel = SchemaModel({
  accountName: StringType().isRequired('Account name is required.'),
  accountNumber: StringType().isRequired('Account number is required.'),
  bankName: StringType().isRequired('Bank name is required.'),
  balance: NumberType().isRequired('Opening balance is required.'),
})

// ========== Initial Form Value ==========
const initialValue = {
  accountName: '',
  accountNumber: '',
  bankName: '',
  balance: 0,
}

// ========== Form Value Type ==========
type FormValue = typeof initialValue

// ========== Payment Method Page Component ==========
const Page = () => {
  // ========== Hooks ==========
  const { mutate: createPaymentMethod, isPending } = useCreatePaymentMethod()
  const { data: paymentMethods } = usePaymentMethods()

  // ========== Modal and Form State ==========
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formValue, setFormValue] = useState<FormValue>(initialValue)
  const formRef = useRef<FormInstance>(null)

  // ========== Handle Modal Close ==========
  const handleClose = () => {
    setIsAddOpen(false)
    setFormValue(initialValue)
  }

  // ========== Handle Form Submit ==========
  const handleFormSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return
    setFormValue(initialValue)
    createPaymentMethod({ ...formValue, balance: Number(formValue.balance) })
    setIsAddOpen(false)
  }

  return (
    <>
      <div className="flex justify-between">
        <Heading level={4}>Payment Method</Heading>
        <Button
          startIcon={<Icon as={IoMdAdd} />}
          appearance="primary"
          onClick={() => setIsAddOpen(true)}
        >
          Add
        </Button>
      </div>
      <Divider>Payment Method List</Divider>
      {/* ========== Add Payment Method Modal ========== */}
      <Modal open={isAddOpen} onClose={handleClose} size="sm" backdrop="static">
        <Modal.Header closeButton={false} className="pl-2">
          <Modal.Title>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-2">
          <Form
            ref={formRef}
            model={FormModel}
            formValue={formValue}
            onChange={(value) => setFormValue(value as FormValue)}
          >
            <div className="flex flex-col gap-y-4">
              <Form.Stack fluid>
                <Form.Group controlId="accountName">
                  <Form.Label>Account Name</Form.Label>
                  <Form.Control block name="accountName" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="accountNumber">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control block name="accountNumber" type="tel" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="bankName">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control block name="bankName" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid className="mb-2">
                <Form.Group controlId="balance">
                  <Form.Label>Opening Balance</Form.Label>
                  <Form.Control
                    block
                    name="balance"
                    accepter={NumberInput}
                    errorPlacement="bottomStart"
                    formatter={(value) =>
                      value !== null && value !== undefined ? Number(value).toLocaleString() : ''
                    }
                  />
                </Form.Group>
              </Form.Stack>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="px-2">
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="default"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            loading={isPending}
            startIcon={<Icon as={IoMdAdd} />}
            appearance="primary"
            onClick={handleFormSubmit}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ========== Payment Method Table ========== */}
      <Table
        autoHeight
        bordered
        cellBordered
        data={paymentMethods?.data}
        onRowClick={
          (/* rowData */) => {
            // console.log(rowData)
          }
        }
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1} minWidth={200}>
          <HeaderCell>Account Name</HeaderCell>
          <Cell dataKey="accountName" />
        </Column>

        <Column width={200}>
          <HeaderCell>Account Number</HeaderCell>
          <Cell dataKey="accountNumber" />
        </Column>

        <Column width={200}>
          <HeaderCell>Bank Name</HeaderCell>
          <Cell dataKey="bankName" />
        </Column>

        <Column width={150}>
          <HeaderCell>Balance</HeaderCell>
          <Cell>{(rowData) => Number(rowData.balance || 0).toLocaleString()}</Cell>
        </Column>

        {/* ========== Action Column with Popover Menu ========== */}
        <Column width={80} fixed="right" align="center">
          <HeaderCell>Action</HeaderCell>

          <Cell verticalAlign="middle">
            {() => (
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
    </>
  )
}

export default Page
