import { Icon, Trash } from '@rsuite/icons'
import { useState } from 'react'
import { CgMore } from 'react-icons/cg'
import { GrView } from 'react-icons/gr'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { TiEdit } from 'react-icons/ti'
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
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

const { Column, HeaderCell, Cell } = Table

const data = [
  {
    id: 1,
    accountName: 'John Doe',
    accountNumber: '1234567890',
    bankName: 'Bank of America',
    openingBalance: 1000,
  },
  {
    id: 2,
    accountName: 'Jane Smith',
    accountNumber: '0987654321',
    bankName: 'Chase Bank',
    openingBalance: 2000,
  },
]

const FormModel = SchemaModel({
  accountName: StringType().isRequired('Account name is required.'),
  accountNumber: StringType().isRequired('Account number is required.'),
  bankName: StringType().isRequired('Bank name is required.'),
  openingBalance: NumberType().isRequired('Opening balance is required.'),
})

const initialValue = {
  accountName: '',
  accountNumber: '',
  bankName: '',
  openingBalance: 0,
}

type FormValue = typeof initialValue

const Page = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  const handleClose = () => {
    setIsAddOpen(false)
    setFormValue(initialValue)
  }

  const handleFormSubmit = () => {
    // console.log('Form submitted', formValue)
    setFormValue(initialValue)
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
      <Modal open={isAddOpen} onClose={handleClose} size="sm" backdrop="static">
        <Form
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <Modal.Header closeButton={false} className="px-2">
            <Modal.Title>
              <Heading level={4} className="text-center">
                Info
              </Heading>
              <Divider />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-2">
            <div className="flex flex-col gap-y-4">
              <Form.Stack fluid>
                <Form.Group controlId="accountName">
                  <Form.Label>Account Name</Form.Label>
                  <Form.Control block name="accountName" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="accountNumber">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control block name="accountNumber" type="tel" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="bankName">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control block name="bankName" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="openingBalance">
                  <Form.Label>Opening Balance</Form.Label>
                  <Form.Control block name="openingBalance" accepter={NumberInput} />
                </Form.Group>
              </Form.Stack>
            </div>
          </Modal.Body>
          <Modal.Footer className="px-2">
            <Button startIcon={<Icon as={IoMdAdd} />} appearance="primary" type="submit">
              Add
            </Button>
            <Button
              startIcon={<Icon as={IoMdClose} />}
              appearance="subtle"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Table
        autoHeight
        bordered
        cellBordered
        data={data}
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
          <HeaderCell>Opening Balance</HeaderCell>
          <Cell dataKey="openingBalance" />
        </Column>

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
                              icon={<Icon as={GrView} />}
                              color="green"
                              size="sm"
                              appearance="primary"
                            >
                              View
                            </IconButton>

                            <IconButton
                              onClick={() => {
                                if (onClose) onClose()
                              }}
                              icon={<Icon as={TiEdit} />}
                              color="blue"
                              size="sm"
                              appearance="primary"
                            >
                              Edit
                            </IconButton>

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
