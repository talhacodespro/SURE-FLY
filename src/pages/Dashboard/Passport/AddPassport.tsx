import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import {
  Form,
  Button,
  Heading,
  Schema,
  Divider,
  DateInput,
  StringType,
  DateType,
  Textarea,
} from 'rsuite'

// Form model
const PassportModel = Schema.Model({
  name: StringType().isRequired('Passport name is required.'),
  number: StringType().isRequired('Passport number is required.'),
  dateOfBirth: DateType().isRequired('Date of birth is required.'),
  expireDate: DateType().isRequired('Passport expire date is required.'),
  mobile: StringType().isRequired('Mobile is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Email is required.'),
  remark: StringType(),
})

// Initial form value
const initialValue = {
  name: '',
  number: '',
  dateOfBirth: null as Date | null,
  expireDate: null as Date | null,
  mobile: '',
  email: '',
  remark: '',
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
        Passport Info
      </Heading>
      <Divider />
      <div>
        <Form
          model={PassportModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            <Form.Stack fluid>
              <Form.Group controlId="name">
                <Form.Label>Passport Name</Form.Label>
                <Form.Control name="name" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="number">
                <Form.Label>Passport Number</Form.Label>
                <Form.Control name="number" type="tel" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control name="dateOfBirth" accepter={DateInput} format="dd/MMM/yyyy" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="expireDate">
                <Form.Label>Expire Date</Form.Label>
                <Form.Control name="expireDate" accepter={DateInput} format="dd/MMM/yyyy" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control name="mobile" type="tel" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid className="col-span-1 md:col-span-2">
              <Form.Group controlId="remark">
                <Form.Label>Remark</Form.Label>
                <Form.Control name="remark" placeholder="(optional)" accepter={Textarea} rows={1} />
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
