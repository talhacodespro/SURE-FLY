import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { Form, Button, Heading, Schema, Divider, DateInput } from 'rsuite'

const { StringType, DateType } = Schema.Types

// Form model
const FormModel = Schema.Model({
  passportName: StringType().isRequired('Passport name is required.'),
  passportNumber: StringType().isRequired('Passport number is required.'),
  dateOfBirth: DateType().isRequired('Date of birth is required.'),
  passportExpireDate: DateType().isRequired('Passport expire date is required.'),
  mobile: StringType().isRequired('Mobile is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Email is required.'),
  remark: StringType(),
})

// Initial form value
const initialValue = {
  passportName: '',
  passportNumber: '',
  dateOfBirth: null as Date | null,
  passportExpireDate: null as Date | null,
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
          fluid
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
            <Form.Group controlId="passportName">
              <Form.ControlLabel>Passport Name</Form.ControlLabel>
              <Form.Control name="passportName" />
            </Form.Group>
            <Form.Group controlId="passportNumber">
              <Form.ControlLabel>Passport Number</Form.ControlLabel>
              <Form.Control name="passportNumber" type="tel" />
            </Form.Group>
            <Form.Group controlId="dateOfBirth">
              <Form.ControlLabel>Date of Birth</Form.ControlLabel>
              <Form.Control name="dateOfBirth" accepter={DateInput} format="dd/MMM/yyyy" />
            </Form.Group>
            <Form.Group controlId="passportExpireDate">
              <Form.ControlLabel>Passport Expire Date</Form.ControlLabel>
              <Form.Control name="passportExpireDate" accepter={DateInput} format="dd/MMM/yyyy" />
            </Form.Group>
            <Form.Group controlId="mobile">
              <Form.ControlLabel>Mobile</Form.ControlLabel>
              <Form.Control name="mobile" type="tel" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.ControlLabel>Email</Form.ControlLabel>
              <Form.Control name="email" />
            </Form.Group>
            <Form.Group controlId="remark" className="col-span-1 md:col-span-2">
              <Form.ControlLabel>Remark</Form.ControlLabel>
              <Form.Control name="remark" placeholder="optional" />
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
