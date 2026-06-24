import { useCreatePassport } from '@/hooks/usePassport'
import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { useNavigate } from 'react-router'
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

// ========== Form Validation Model ==========
const PassportModel = Schema.Model({
  fullName: StringType().isRequired('Passport name is required.'),
  passportNo: StringType().isRequired('Passport number is required.'),
  dob: DateType().isRequired('Date of birth is required.'),
  expiryDate: DateType().isRequired('Passport expire date is required.'),
  phone: StringType().isRequired('Mobile is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Email is required.'),
  remarks: StringType(),
})

// ========== Initial Form Value ==========
const initialValue = {
  fullName: '',
  passportNo: '',
  dob: null as Date | null,
  expiryDate: null as Date | null,
  phone: '',
  email: '',
  remarks: '',
}

// ========== Form Value Type ==========
type FormValue = typeof initialValue

// ========== Add Passport Page Component ==========
const Page = () => {
  // ========== Form Value State ==========
  const [formValue, setFormValue] = useState<FormValue>(initialValue)
  const { mutate: createPassport, isPending } = useCreatePassport()
  const navigate = useNavigate()

  // ========== Handle Form Submit ==========
  const handleFormSubmit = () => {
    const { dob, expiryDate, ...rest } = formValue
    createPassport(
      {
        dob: dob?.toISOString() || null,
        expiryDate: expiryDate?.toISOString() || null,
        ...rest,
      },
      {
        onSuccess: () => {
          setFormValue(initialValue)
          navigate('/list-passport')
        },
      },
    )
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Passport Info
      </Heading>
      <Divider />
      <div>
        {/* ========== Add Passport Form ========== */}
        <Form
          model={PassportModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            <Form.Stack fluid>
              <Form.Group controlId="fullName">
                <Form.Label>Passport Name</Form.Label>
                <Form.Control name="fullName" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="passportNo">
                <Form.Label>Passport Number</Form.Label>
                <Form.Control name="passportNo" type="tel" errorPlacement="bottomEnd" />
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
            <Form.Stack fluid>
              <Form.Group controlId="expiryDate">
                <Form.Label>Expire Date</Form.Label>
                <Form.Control
                  name="expiryDate"
                  accepter={DateInput}
                  format="dd/MMM/yyyy"
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid className="col-span-1 md:col-span-2">
              <Form.Group controlId="remarks">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  name="remarks"
                  placeholder="(optional)"
                  accepter={Textarea}
                  rows={1}
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
          </div>
          <Form.Group className="mt-5 flex justify-end">
            <Button
              loading={isPending}
              disabled={isPending}
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
