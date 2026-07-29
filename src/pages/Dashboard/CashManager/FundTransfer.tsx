import { useFundTransfer, usePaymentMethods } from '@/hooks/useTransaction'
import { Icon } from '@rsuite/icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BiTransferAlt } from 'react-icons/bi'
import {
  Form,
  Button,
  Heading,
  Divider,
  Textarea,
  SelectPicker,
  NumberInput,
  type FormInstance,
} from 'rsuite'
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

// ========== Form Validation Model ==========
const FormModel = SchemaModel({
  fromAccount: StringType().isRequired('From account is required.'),

  toAccount: StringType()
    .isRequired('To account is required.')
    .addRule(
      (value, data) => value !== data.fromAccount,
      'From and To account cannot be the same.',
    ),

  transferAmount: NumberType()
    .isRequired('Transfer amount is required.')
    .addRule((value, data) => {
      if (value == null) return false

      return value <= data.fromAccountBalance
    }, 'Transfer amount cannot be greater than account balance.'),

  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('transferAmount', "Amount doesn't match."),

  remarks: StringType(),
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

// ========== Fund Transfer Page Component ==========
const Page = () => {
  // ========== Fund Transfer Mutation ==========
  const { mutateAsync: fundTransferMutate, isPending } = useFundTransfer()

  // ========== Form Ref ==========
  const formRef = useRef<FormInstance>(null)

  // ========== Form Value State ==========
  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  // =========== Hooks ==========
  const { data: paymentMethodsRes, isLoading } = usePaymentMethods()

  const paymentMethodData = useMemo(() => {
    return (paymentMethodsRes?.data || []).map((item) => ({
      label: `${item.accountName} (${item.bankName})`,
      value: String(item.id),
    }))
  }, [paymentMethodsRes])

  const fromAccount = useMemo(() => {
    return paymentMethodsRes?.data?.find((item) => item.id === Number(formValue.fromAccount))
  }, [paymentMethodsRes, formValue.fromAccount])

  const toAccount = useMemo(() => {
    return paymentMethodsRes?.data?.find((item) => item.id === Number(formValue.toAccount))
  }, [paymentMethodsRes, formValue.toAccount])

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      fromAccountBalance: fromAccount?.balance ?? 0,
      toAccountBalance: toAccount?.balance ?? 0,
      transferAmount: null,
      confirmAmount: null,
    }))
  }, [fromAccount?.balance, toAccount?.balance])

  // ========== Handle Form Change ==========
  const handleFormChange = (value: FormValue) => {
    const updatedValue = { ...value }

    setFormValue(updatedValue)
  }

  // ========== Handle Form Submit ==========
  const handleFormSubmit = () => {
    if (!formRef.current?.check()) return

    const payload = {
      fromAccountId: Number(formValue.fromAccount),
      toAccountId: Number(formValue.toAccount),
      amount: Number(formValue.transferAmount),
      remarks: formValue.remarks.trim(),
    }

    fundTransferMutate(payload, {
      onSuccess: () => {
        setFormValue(initialValue)
      },
    })
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
          ref={formRef}
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
                  data={paymentMethodData}
                  loading={isLoading}
                  searchable={false}
                  errorPlacement="bottomEnd"
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
                  data={paymentMethodData}
                  loading={isLoading}
                  searchable={false}
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="fromAccountBalance">
                <Form.Label>From Account Balance</Form.Label>
                <Form.Control
                  name="fromAccountBalance"
                  readOnly
                  value={formValue.fromAccountBalance.toLocaleString()}
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="toAccountBalance">
                <Form.Label>To Account Balance</Form.Label>
                <Form.Control
                  name="toAccountBalance"
                  readOnly
                  value={formValue.toAccountBalance.toLocaleString()}
                />
              </Form.Group>
            </Form.Stack>

            <Form.Stack fluid>
              <Form.Group controlId="transferAmount">
                <Form.Label>Transfer Amount</Form.Label>
                <Form.Control
                  name="transferAmount"
                  accepter={NumberInput}
                  min={1}
                  max={formValue.fromAccountBalance}
                  errorPlacement="bottomEnd"
                  formatter={(value) =>
                    value !== null && value !== undefined ? Number(value).toLocaleString() : ''
                  }
                />
              </Form.Group>
            </Form.Stack>
            <Form.Stack fluid>
              <Form.Group controlId="confirmAmount">
                <Form.Label>Confirm Amount</Form.Label>
                <Form.Control
                  name="confirmAmount"
                  accepter={NumberInput}
                  min={0}
                  formatter={(value) =>
                    value !== null && value !== undefined ? Number(value).toLocaleString() : ''
                  }
                />
              </Form.Group>
            </Form.Stack>

            <Form.Stack fluid className="md:col-span-2">
              <Form.Group controlId="remarks">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  placeholder="(optional)"
                  name="remarks"
                  accepter={Textarea}
                  rows={1}
                />
              </Form.Group>
            </Form.Stack>
          </div>
          <Form.Group className="mt-5 flex justify-end">
            <Button
              loading={isPending}
              disabled={isPending}
              startIcon={<Icon as={BiTransferAlt} />}
              appearance="primary"
              type="submit"
            >
              Transfer
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

export default Page
