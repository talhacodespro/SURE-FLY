import { Icon } from '@rsuite/icons'
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Form, Button, Heading, Divider, Textarea, SelectPicker, NumberInput } from 'rsuite'
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

// ========== Form Validation Model ==========
const FormModel = SchemaModel({
  fromAccount: StringType().isRequired('From Account is required.'),
  toAccount: StringType().isRequired('To Account is required.'),
  transferAmount: NumberType()
    .isRequired('Transfer amount is required.')
    .addRule((value, data) => {
      if (data.fromAccountBalance && value > data.fromAccountBalance) {
        return false
      }
      return true
    }, 'Insufficient balance.'),
  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('transferAmount', "Amount doesn't match."),
  remarks: StringType().isRequired('Remark is required.'),
})

// ========== Initial Form Value ==========
const initialValue = {
  fromAccount: '',
  toAccount: '',
  fromAccountBalance: 0,
  toAccountBalance: 0,
  transferAmount: null,
  confirmAmount: null,
  remarks: '',
}

// ========== Form Value Type ==========
type FormValue = typeof initialValue

// ========== Mock Account List Data ==========
const accountList = [
  { label: 'Cash Account', value: 'cash', balance: 50000 },
  { label: 'Bank Asia', value: 'bank_asia', balance: 120000 },
  { label: 'Islami Bank', value: 'islami_bank', balance: 85000 },
  { label: 'Bkash Agent', value: 'bkash', balance: 25000 },
]

// ========== Fund Transfer Page Component ==========
const Page = () => {
  // ========== Form Value State ==========
  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  // ========== Handle Form Change ==========
  const handleFormChange = (value: FormValue) => {
    const updatedValue = { ...value }

    // Update From Account Balance if account changes
    if (value.fromAccount !== formValue.fromAccount) {
      const account = accountList.find((item) => item.value === value.fromAccount)
      updatedValue.fromAccountBalance = account ? account.balance : 0
    }

    // Update To Account Balance if account changes
    if (value.toAccount !== formValue.toAccount) {
      const account = accountList.find((item) => item.value === value.toAccount)
      updatedValue.toAccountBalance = account ? account.balance : 0
    }

    setFormValue(updatedValue)
  }

  // ========== Handle Form Submit ==========
  const handleFormSubmit = () => {
    setFormValue(initialValue)
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Fund Transfer Info
      </Heading>
      <Divider />
      <div>
        {/* ========== Fund Transfer Form ========== */}
        <Form
          model={FormModel}
          formValue={formValue}
          onChange={(value) => handleFormChange(value as FormValue)}
          onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
            <Form.Stack fluid>
              <Form.Group controlId="fromAccount">
                <Form.Label>From Account</Form.Label>
                <Form.Control
                  block
                  name="fromAccount"
                  accepter={SelectPicker}
                  data={accountList}
                  searchable={false}
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="toAccount">
                <Form.Label>To Account</Form.Label>
                <Form.Control
                  block
                  name="toAccount"
                  accepter={SelectPicker}
                  data={accountList}
                  searchable={false}
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="fromAccountBalance">
                <Form.Label>Account Balance</Form.Label>
                <Form.Control name="fromAccountBalance" type="number" readOnly />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="toAccountBalance">
                <Form.Label>Account Balance</Form.Label>
                <Form.Control name="toAccountBalance" type="number" readOnly />
              </Form.Group>
            </Form.Stack>

            <Form.Stack fluid>
              <Form.Group controlId="transferAmount">
                <Form.Label>Transfer Amount</Form.Label>
                <Form.Control name="transferAmount" accepter={NumberInput} min={0} />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="confirmAmount">
                <Form.Label>Confirm Amount</Form.Label>
                <Form.Control name="confirmAmount" accepter={NumberInput} min={0} />
              </Form.Group>
            </Form.Stack>

            <Form.Stack fluid className="md:col-span-2">
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
