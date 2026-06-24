import { Icon } from '@rsuite/icons'
import { useEffect, useRef, useState } from 'react'
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
  useToaster,
} from 'rsuite'
import type { FormInstance } from 'rsuite'
import { useLocation, useNavigate, useParams } from 'react-router'
import { usePassport, useUpdatePassport } from '@/hooks/usePassport'
import type { Passport } from '@/lib/api/passport'

// ========== Form Validation Model ==========
const FormModel = Schema.Model({
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

// ========== Form Value Type ==========
type FormValue = {
  fullName: string
  passportNo: string
  dob: Date | null
  expiryDate: Date | null
  phone: string
  email: string
  remarks: string
}

// ========== Parse Date Helper Function ==========
const parseDate = (val: unknown): Date | null => {
  if (!val) return null
  if (val instanceof Date) return val
  if (typeof val === 'string') {
    const d = new Date(val)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

// ========== Edit Passport Page Component ==========
const Page = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toaster = useToaster()
  const { state } = useLocation() as {
    state?: Partial<Passport>
  }

  // ========== Hooks for Fetching and Updating Passport ==========
  const { data: passport, isLoading: isFetching } = usePassport(Number(id), !!id && !state)
  const { mutate: updatePassport, isPending: isUpdating } = useUpdatePassport()

  // ========== Form Value State ==========
  const [formValue, setFormValue] = useState<FormValue>({
    fullName: '',
    passportNo: '',
    dob: null,
    expiryDate: null,
    phone: '',
    email: '',
    remarks: '',
  })

  // ========== Load Passport Data into Form ==========
  useEffect(() => {
    const data = state || passport
    if (data) {
      setFormValue({
        fullName: String(data.fullName || ''),
        passportNo: String(data.passportNo || ''),
        dob: parseDate(data.dob),
        expiryDate: parseDate(data.expiryDate),
        phone: String(data.phone || ''),
        email: String(data.email || ''),
        remarks: String(data.remarks || ''),
      })
    }
  }, [state, passport])

  const formRef = useRef<FormInstance>(null)

  // ========== Handle Form Submit ==========
  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid || !id) return

    updatePassport(
      { id: Number(id), payload: formValue as unknown as Partial<Passport> },
      {
        onSuccess: () => {
          toaster.push(<Message type="success">Passport updated successfully</Message>, {
            placement: 'bottomEnd',
          })
          navigate('/list-passport')
        },
      },
    )
  }

  if (isFetching) {
    return <div className="p-5 text-center">Loading...</div>
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Edit Passport
      </Heading>
      <Divider />
      <div>
        {/* ========== Edit Passport Form ========== */}
        <Form
          ref={formRef}
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
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
                <Form.Label>Mobile</Form.Label>
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
                <Form.Label>Remark</Form.Label>
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
          <div className="mt-5 flex justify-end gap-2">
            <Button
              startIcon={<Icon as={IoMdClose} />}
              appearance="subtle"
              type="button"
              onClick={() => navigate('/list-passport')}
            >
              Cancel
            </Button>
            <Button
              startIcon={<Icon as={IoMdSave} />}
              appearance="primary"
              type="button"
              onClick={handleSubmit}
              loading={isUpdating || isFetching}
              disabled={isUpdating || isFetching}
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Page
