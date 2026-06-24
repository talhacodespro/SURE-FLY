import { Icon, Trash } from '@rsuite/icons'
import { useState, useRef } from 'react'
import { CgMore } from 'react-icons/cg'
import { IoMdAdd, IoMdClose } from 'react-icons/io'
import { Button, Heading, Divider, Modal, Table, IconButton, Popover, Whisper, Form } from 'rsuite'
import type { FormInstance } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'

const { Column, HeaderCell, Cell } = Table

// ========== Mock Expense Category Data ==========
const data = [
  {
    id: 1,
    categoryName: 'Food',
    remarks: 'Daily food expense',
  },
  {
    id: 2,
    categoryName: 'Transport',
    remarks: 'Taxi, bus, etc.',
  },
]

// ========== Form Validation Model ==========
const FormModel = SchemaModel({
  categoryName: StringType().isRequired('Category name is required.'),
  remarks: StringType().isRequired('Remark is required.'),
})

// ========== Initial Form Value ==========
const initialValue = {
  categoryName: '',
  remarks: '',
}

// ========== Form Value Type ==========
type FormValue = typeof initialValue

// ========== Expense Category Page Component ==========
const Page = () => {
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
    setIsAddOpen(false)
  }

  return (
    <>
      <div className="flex justify-between">
        <Heading level={4}>Expense Category</Heading>
        <Button
          startIcon={<Icon as={IoMdAdd} />}
          appearance="primary"
          onClick={() => setIsAddOpen(true)}
        >
          Add
        </Button>
      </div>
      <Divider>Expense Category List</Divider>
      {/* ========== Add Category Modal ========== */}
      <Modal open={isAddOpen} onClose={handleClose} size="sm" backdrop="static">
        <Modal.Header closeButton={false} className="pl-2">
          <Modal.Title>Category Info</Modal.Title>
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
                <Form.Group controlId="categoryName">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control block name="categoryName" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid className="mb-2">
                <Form.Group controlId="remarks">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control block name="remarks" />
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
          <Button startIcon={<Icon as={IoMdAdd} />} appearance="primary" onClick={handleFormSubmit}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ========== Expense Category Table ========== */}
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
          <HeaderCell>Category Name</HeaderCell>
          <Cell dataKey="categoryName" />
        </Column>

        <Column flexGrow={1} minWidth={250}>
          <HeaderCell>Remarks</HeaderCell>
          <Cell dataKey="remarks" />
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
