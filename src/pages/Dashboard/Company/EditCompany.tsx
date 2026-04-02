import { Icon } from '@rsuite/icons'
import { useEffect, useRef, useState } from 'react'
import { IoMdClose, IoMdSave } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router'
import { Button, Divider, Form, type FormInstance, Heading, Textarea } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'
import { useCompany, useUpdateCompany } from '@/hooks/useCompany'

const FormModel = SchemaModel({
  name: StringType().isRequired('Name is required.'),
  phone: StringType().isRequired('Mobile is required.'),
  contactName: StringType().isRequired('Contact person name is required.'),
  contactPhone: StringType().isRequired('Contact person mobile is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('Email is required.'),
  address: StringType().isRequired('Address is required.'),
  remarks: StringType().isRequired('Remark is required.'),
})

const DEFAULT_FORM_VALUE = {
  name: '',
  phone: '',
  contactName: '',
  contactPhone: '',
  email: '',
  address: '',
  remarks: '',
}

type FormValue = typeof DEFAULT_FORM_VALUE

const Page = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data, isLoading } = useCompany(Number(id), Boolean(id))
  const { mutate: updateMutation, isPending } = useUpdateCompany()
  const [formValue, setFormValue] = useState<FormValue>(DEFAULT_FORM_VALUE)
  const formRef = useRef<FormInstance>(null)

  const handleSubmit = () => {
    if (!formRef.current?.check()) return

    updateMutation(
      {
        id: Number(id),
        payload: formValue,
      },
      {
        onSuccess: () => {
          navigate('/list-company')
        },
      },
    )
  }

  useEffect(() => {
    if (data) {
      setFormValue(data)
    }
  }, [data])

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Edit Company
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
                <Form.Label>Company Name</Form.Label>
                <Form.Control name="name" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="phone">
                <Form.Label>Company Phone</Form.Label>
                <Form.Control name="phone" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="contactName">
                <Form.Label>Contact Person Name</Form.Label>
                <Form.Control name="contactName" type="text" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="contactPhone">
                <Form.Label>Contact Person Phone</Form.Label>
                <Form.Control name="contactPhone" type="tel" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Company Email</Form.Label>
                <Form.Control name="email" type="email" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="address">
                <Form.Label>Company Address</Form.Label>
                <Form.Control name="address" accepter={Textarea} rows={1} />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid className="col-span-1 md:col-span-2">
              <Form.Group controlId="remarks">
                <Form.Label>Remarks</Form.Label>
                <Form.Control name="remarks" accepter={Textarea} rows={1} />
              </Form.Group>
            </Form.Stack>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button
              startIcon={<Icon as={IoMdSave} />}
              appearance="primary"
              type="button"
              onClick={handleSubmit}
              loading={isPending || isLoading}
              disabled={isPending || isLoading}
            >
              Save
            </Button>
            <Button
              startIcon={<Icon as={IoMdClose} />}
              appearance="subtle"
              type="button"
              onClick={() => navigate('/list-company')}
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
