import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Form, Button, Heading, Divider, Textarea, SelectPicker, NumberInput } from 'rsuite'
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

// --- Constants ---
const ACCOUNTS = [
  { label: 'Cash', value: 'Cash', balance: 100000 },
  { label: 'Bank', value: 'Bank', balance: 50000 },
  { label: 'Mobile Money', value: 'Mobile Money', balance: 20000 },
]

const CATEGORIES = [
  { label: 'Food', value: 'Food' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Rent', value: 'Rent' },
  { label: 'Others', value: 'Others' },
]

// Form model
const FormModel = SchemaModel({
  account: StringType().isRequired('Account selection is required.'),
  category: StringType().isRequired('Expense category is required.'),
  amount: NumberType().isRequired('Amount is required.').min(1, 'Amount must be greater than 0.'),
  confirmAmount: NumberType()
    .isRequired('Please confirm the amount.')
    .equalTo('amount', 'Amounts do not match.'),
  remarks: StringType().isRequired('Remark is required.'),
})

// --- Initial State ---
const initialValues = {
  account: '',
  category: '',
  amount: null,
  confirmAmount: null,
  remarks: '',
}

// Type definition ⤵
type FormValue = typeof initialValues

const Page = () => {
  // Form value
  const [formValue, setFormValue] = useState<FormValue>(initialValues)

  // Handle form submit
  const handleFormSubmit = () => {
    setFormValue(initialValues)
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Expense Info
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
              <Form.Group controlId="account">
                <Form.Label>Select Account</Form.Label>
                <Form.Control
                  block
                  name="account"
                  accepter={SelectPicker}
                  data={ACCOUNTS}
                  searchable={false}
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="accountBalance">
                <Form.Label>Account Balance</Form.Label>
                <Form.Control
                  name="accountBalance"
                  type="number"
                  readOnly
                  value={ACCOUNTS.find((item) => item.value === formValue.account)?.balance || 0}
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="category">
                <Form.Label>Expense Category</Form.Label>
                <Form.Control
                  name="category"
                  accepter={SelectPicker}
                  data={CATEGORIES}
                  block
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="amount">
                <Form.Label>Payment Amount</Form.Label>
                <Form.Control
                  name="amount"
                  accepter={NumberInput}
                  min={0}
                  block
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="confirmAmount">
                <Form.Label>Confirm Amount</Form.Label>
                <Form.Control block name="confirmAmount" accepter={NumberInput} min={0} />
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
