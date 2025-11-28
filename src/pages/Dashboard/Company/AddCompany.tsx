import Textarea from '@/components/Textarea'
import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { Form, Button, Heading, Schema, Divider } from 'rsuite'

const { StringType } = Schema.Types

// Form model
const FormModel = Schema.Model({
  name: StringType().isRequired('Name is required.'),
  mobile: StringType().isRequired('Mobile is required.'),
  contactPersonName: StringType().isRequired('Contact person name is required.'),
  contactPersonMobile: StringType().isRequired('Contact person mobile is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Email is required.'),
  address: StringType().isRequired('Address is required.'),
  remarks: StringType().isRequired('Remark is required.'),
})

// Initial form value
const initialValue = {
  type: '',
  name: '',
  email: '',
  mobile: '',
  address: '',
}

// Type definition ⤵
type FormValue = typeof initialValue

const Page = () => {
  // Form value
  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  // Handle form submit
  const handleFormSubmit = () => {
    console.log('Form submitted', formValue)
    setFormValue(initialValue)
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Company Info
      </Heading>
      <Divider />
      <div>
        <Form
          fluid
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
            <Form.Group controlId="name">
              <Form.ControlLabel>Company Name</Form.ControlLabel>
              <Form.Control name="name" />
            </Form.Group>
            <Form.Group controlId="mobile">
              <Form.ControlLabel>Company Mobile</Form.ControlLabel>
              <Form.Control name="mobile" type="tel" />
            </Form.Group>
            <Form.Group controlId="contactPersonName">
              <Form.ControlLabel>Contact Person Name</Form.ControlLabel>
              <Form.Control name="contactPersonName" type="text" />
            </Form.Group>
            <Form.Group controlId="contactPersonMobile">
              <Form.ControlLabel>Contact Person Mobile</Form.ControlLabel>
              <Form.Control name="contactPersonMobile" type="tel" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Company Email</Form.ControlLabel>
              <Form.Control name="email" type="email" />
            </Form.Group>
            <Form.Group controlId="address" className="">
              <Form.ControlLabel>Company Address</Form.ControlLabel>
              <Form.Control name="address" accepter={Textarea} rows={1} />
            </Form.Group>
            <Form.Group controlId="remarks" className="md:col-span-2">
              <Form.ControlLabel>Remarks</Form.ControlLabel>
              <Form.Control name="remarks" accepter={Textarea} rows={1} />
            </Form.Group>
          </div>
          <Form.Group className="mt-5 flex justify-end">
            <Button
              startIcon={<Icon as={IoMdAddCircleOutline} />}
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
