import { useSearchCompanies } from '@/hooks/useCompany'
import { Icon } from '@rsuite/icons'
import { useMemo, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Form, Button, Heading, Divider, Textarea, SelectPicker, NumberInput } from 'rsuite'
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

// ========== Form Validation Model ==========
const FormModel = SchemaModel({
  company: StringType().isRequired('Company is required.'),
  dueAmount: NumberType().isRequired('Due amount is required.'),
  receiveAmount: NumberType().isRequired('Receive amount is required.'),
  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('receiveAmount', "Amount doesn't match."),
  receiverAccount: StringType().isRequired('Receiver account is required.'),
  remarks: StringType().isRequired('Remark is required.'),
})

// ========== Initial Form Value ==========
const initialValue = {
  company: '',
  dueAmount: 10,
  receiveAmount: null,
  confirmAmount: null,
  receiverAccount: '',
  remarks: '',
}

// ========== Form Value Type ==========
type FormValue = typeof initialValue

// ========== Receive Voucher Page Component ==========
const Page = () => {
  // ========== Companies Query ==========
  const { data: companiesRes } = useSearchCompanies()
  console.log(`companiesRes`, companiesRes)
  // ========== Form Value State ==========
  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  // ========== Handle Form Submit ==========
  const handleFormSubmit = () => {
    setFormValue(initialValue)
  }

  // ========== Company Data ==========
  const companyData = useMemo(() => {
    return (companiesRes?.data || []).map((item) => ({
      label: item.name,
      value: String(item.id),
    }))
  }, [companiesRes])

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Receive Voucher Info
      </Heading>
      <Divider />
      <div>
        {/* ========== Receive Voucher Form ========== */}
        <Form
          model={FormModel}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            <Form.Stack fluid>
              <Form.Group controlId="company">
                <Form.Label>Company</Form.Label>
                <Form.Control block name="company" accepter={SelectPicker} data={companyData} />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="dueAmount">
                <Form.Label>Due Amount</Form.Label>
                <Form.Control name="dueAmount" type="number" readOnly />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="receiveAmount">
                <Form.Label>Receive Amount</Form.Label>
                <Form.Control name="receiveAmount" accepter={NumberInput} min={0} />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="confirmAmount">
                <Form.Label>Confirm Amount</Form.Label>
                <Form.Control name="confirmAmount" accepter={NumberInput} min={0} />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="receiverAccount">
                <Form.Label>Receiver Account</Form.Label>
                <Form.Control
                  block
                  name="receiverAccount"
                  accepter={SelectPicker}
                  data={[{ label: 'Cash', value: 'Cash' }]}
                  searchable={false}
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="remarks">
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
