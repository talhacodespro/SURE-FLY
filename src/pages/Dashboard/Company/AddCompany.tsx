import { Icon } from '@rsuite/icons'
import { useRef, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Form, Button, Heading, Divider, Textarea } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'
import type { FormInstance } from 'rsuite'
import { useNavigate } from 'react-router'
import { useCreateCompany } from '@/hooks/useCompany'

// ========== Form Validation Model ==========
// Company add form er validation rules define kora hocche
const FormModel = SchemaModel({
  name: StringType().isRequired('Name is required.'),
  phone: StringType().isRequired('Phone is required.'),
  contactName: StringType().isRequired('Contact person name is required.'),
  contactPhone: StringType().isRequired('Contact person phone is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Email is required.'),
  address: StringType().isRequired('Address is required.'),
  remarks: StringType(),
})

// ========== Initial Form Value ==========
const initialValue = {
  name: '',
  email: '',
  phone: '',
  address: '',
  contactName: '',
  contactPhone: '',
  remarks: '',
}

// ========== Form Value Type ==========
type FormValue = typeof initialValue

// ========== Add Company Page Component ==========
const Page = () => {
  const { mutate: createCompany, isPending } = useCreateCompany() // Create company mutation hook
  const [formValue, setFormValue] = useState<FormValue>(initialValue) // Form er current state
  const formRef = useRef<FormInstance>(null) // Form er reference
  const navigate = useNavigate()

  // ========== Handle Form Submit ==========
  const handleFormSubmit = async () => {
    const valid = formRef.current?.check() // Form validity check
    if (!valid) return

    createCompany(formValue, {
      onSuccess: () => {
        setFormValue(initialValue) // Form reset
        navigate('/list-company') // Company list page e redirect
      },
    })
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Company Info
      </Heading>
      <Divider />
      <div>
        {/* ========== Company Add Form ========== */}
        <Form
          ref={formRef}
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            {/* ========== Company Name Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="name">
                <Form.Label>Company Name</Form.Label>
                <Form.Control name="name" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            {/* ========== Company Phone Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="phone">
                <Form.Label>Company Phone</Form.Label>
                <Form.Control name="phone" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            {/* ========== Contact Person Name Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="contactName">
                <Form.Label>Contact Person Name</Form.Label>
                <Form.Control name="contactName" type="text" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            {/* ========== Contact Person Phone Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="contactPhone">
                <Form.Label>Contact Person Phone</Form.Label>
                <Form.Control name="contactPhone" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            {/* ========== Company Email Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Company Email</Form.Label>
                <Form.Control name="email" type="email" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            {/* ========== Company Address Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="address" className="">
                <Form.Label>Company Address</Form.Label>
                <Form.Control name="address" accepter={Textarea} rows={1} />
              </Form.Group>
            </Form.Stack>
            {/* ========== Remarks Section ========== */}
            <Form.Stack fluid className="col-span-1 md:col-span-2">
              <Form.Group controlId="remarks" className="md:col-span-2">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  placeholder="(optional)"
                  name="remarks"
                  accepter={Textarea}
                  rows={1}
                />
              </Form.Group>
            </Form.Stack>
          </div>
          {/* ========== Add Button ========== */}
          <Form.Group className="mt-5 flex justify-end">
            <Button
              disabled={isPending}
              loading={isPending}
              startIcon={<Icon as={IoMdAdd} />}
              appearance="primary"
              type="submit"
            >
              Add
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Page
