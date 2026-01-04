import { Icon } from '@rsuite/icons'
import { useRef, useState } from 'react'
import { IoMdSave, IoMdClose } from 'react-icons/io'
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
  Message,
  toaster,
} from 'rsuite'
import type { FormInstance } from 'rsuite'
import { useLocation, useNavigate } from 'react-router'

const FormModel = Schema.Model({
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

type FormValue = {
  name: string
  number: string
  dateOfBirth: Date | null
  expireDate: Date | null
  mobile: string
  email: string
  remark: string
}

const parseDate = (val: unknown): Date | null => {
  if (!val) return null
  if (val instanceof Date) return val
  if (typeof val === 'string') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

const Page = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as {
    state?: Partial<FormValue & { dateOfBirth?: unknown; expireDate?: unknown }>
  }

  const [formValue, setFormValue] = useState<FormValue>({
    name: String(state?.name || ''),
    number: String(state?.number || ''),
    dateOfBirth: parseDate(state?.dateOfBirth),
    expireDate: parseDate(state?.expireDate),
    mobile: String(state?.mobile || ''),
    email: String(state?.email || ''),
    remark: String(state?.remark || ''),
  })
  const formRef = useRef<FormInstance>(null)

  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return
    toaster.push(<Message type="success">Passport updated</Message>, { placement: 'bottomEnd' })
    navigate('/list-passport')
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Edit Passport
      </Heading>
      <Divider />
      <div>
        <Form
          ref={formRef}
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            <Form.Stack fluid>
              <Form.Group controlId="name">
                <Form.Label>Passport Name</Form.Label>
                <Form.Control name="name" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="number">
                <Form.Label>Passport Number</Form.Label>
                <Form.Control name="number" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  name="dateOfBirth"
                  accepter={DateInput}
                  format="dd/MMM/yyyy"
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="expireDate">
                <Form.Label>Expire Date</Form.Label>
                <Form.Control
                  name="expireDate"
                  accepter={DateInput}
                  format="dd/MMM/yyyy"
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="mobile">
                <Form.Label>Mobile</Form.Label>
                <Form.Control name="mobile" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid className="col-span-1 md:col-span-2">
              <Form.Group controlId="remark">
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  name="remark"
                  placeholder="(optional)"
                  accepter={Textarea}
                  rows={1}
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              startIcon={<Icon as={IoMdSave} />}
              appearance="primary"
              type="button"
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button
              startIcon={<Icon as={IoMdClose} />}
              appearance="subtle"
              type="button"
              onClick={() => navigate('/list-passport')}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Page
