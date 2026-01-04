import { Icon } from '@rsuite/icons'
import { useRef, useState } from 'react'
import { IoMdSave, IoMdClose } from 'react-icons/io'
import { Form, Button, Heading, Divider, Textarea, Message, toaster } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'
import { useNavigate } from 'react-router'
import type { FormInstance } from 'rsuite'

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

type FormValue = {
  name: string
  mobile: string
  contactPersonName: string
  contactPersonMobile: string
  email: string
  address: string
  remarks: string
}

const Page = () => {
  const navigate = useNavigate()
  const [formValue, setFormValue] = useState<FormValue>({
    name: '',
    mobile: '',
    contactPersonName: '',
    contactPersonMobile: '',
    email: '',
    address: '',
    remarks: '',
  })
  const formRef = useRef<FormInstance>(null)

  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return
    toaster.push(<Message type="success">Company updated</Message>, { placement: 'bottomEnd' })
    navigate('/list-company')
  }

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
