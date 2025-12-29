import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Form, Button, Heading, Divider, Textarea } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'

// Form model
const FormModel = SchemaModel({
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
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            <Form.Stack fluid>
              <Form.Group controlId="name">
                <Form.Label>Company Name</Form.Label>
                <Form.Control name="name" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="mobile">
                <Form.Label>Company Mobile</Form.Label>
                <Form.Control name="mobile" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="contactPersonName">
                <Form.Label>Contact Person Name</Form.Label>
                <Form.Control name="contactPersonName" type="text" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="contactPersonMobile">
                <Form.Label>Contact Person Mobile</Form.Label>
                <Form.Control name="contactPersonMobile" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Company Email</Form.Label>
                <Form.Control name="email" type="email" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="address" className="">
                <Form.Label>Company Address</Form.Label>
                <Form.Control name="address" accepter={Textarea} rows={1} />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid className="col-span-1 md:col-span-2">
              <Form.Group controlId="remarks" className="md:col-span-2">
                <Form.Label>Remarks</Form.Label>
                <Form.Control name="remarks" accepter={Textarea} rows={1} />
              </Form.Group>
            </Form.Stack>
          </div>
          <Form.Group className="mt-5 flex justify-end">
            <Button startIcon={<Icon as={IoMdAdd} />} appearance="primary" type="submit">
              Add
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Page
