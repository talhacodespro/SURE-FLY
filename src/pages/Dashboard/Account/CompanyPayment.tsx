import { useCompanyBalance, useSearchCompanies } from '@/hooks/useCompany'
import { usePaymentMethods, useSendPayment } from '@/hooks/useTransaction'
import { Icon } from '@rsuite/icons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MdPayment } from 'react-icons/md'
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

const FormModel = SchemaModel({
  company: StringType().isRequired('Company is required.'),
  accountBalance: NumberType().isRequired('Balance is required.'),
  paymentAmount: NumberType()
    .isRequired('Payment amount is required.')
    .addRule((value, data) => {
      if (value > data.accountBalance) {
        return false
      }
      return true
    }, 'Insufficient balance.'),

  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('paymentAmount', "Amount doesn't match."),

  paymentMethod: StringType().isRequired('Payment method is required.'),

  remarks: StringType(),
})

const initialValue = {
  company: '',
  payableAmount: 0,
  accountBalance: 0,
  paymentMethod: '',
  paymentAmount: null as number | null,
  confirmAmount: null as number | null,
  remarks: '',
}

type FormValue = typeof initialValue

const Page = () => {
  const formRef = useRef<FormInstance>(null)
  const { mutate: sendPaymentMutate, isPending } = useSendPayment()

  const { data: companiesRes, isLoading: companiesLoading } = useSearchCompanies()

  const { data: paymentMethodsRes, isLoading: paymentMethodsLoading } = usePaymentMethods()

  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  const selectedCompanyId = formValue.company ? Number(formValue.company) : 0

  const { data: companyBalanceRes } = useCompanyBalance(selectedCompanyId)

  // ================= Selected Payment Method =================
  const selectedPaymentMethod = useMemo(() => {
    return paymentMethodsRes?.data?.find((item) => item.id === Number(formValue.paymentMethod))
  }, [paymentMethodsRes, formValue.paymentMethod])

  const accountBalance = selectedPaymentMethod?.balance ?? 0

  const companyData = useMemo(() => {
    return (companiesRes?.data || []).map((item) => ({
      label: item.name,
      value: String(item.id),
    }))
  }, [companiesRes])

  const paymentMethodData = useMemo(() => {
    return (paymentMethodsRes?.data || []).map((item) => ({
      label: `${item.accountName} (${item.bankName})`,
      value: String(item.id),
    }))
  }, [paymentMethodsRes])

  useEffect(() => {
    setFormValue((prev) => {
      if (
        prev.payableAmount === (companyBalanceRes?.balance ?? 0) &&
        prev.accountBalance === accountBalance
      ) {
        return prev
      }

      return {
        ...prev,
        payableAmount: companyBalanceRes?.balance ?? 0,
        accountBalance: accountBalance,
        paymentAmount: null,
        confirmAmount: null,
      }
    })
  }, [companyBalanceRes?.balance, accountBalance])

  const handleFormSubmit = () => {
    if (!formRef.current?.check()) return

    const payload = {
      companyId: Number(formValue.company),
      amount: Number(formValue.paymentAmount),
      paymentMethodId: Number(formValue.paymentMethod),
      remarks: formValue.remarks.trim(),
    }

    sendPaymentMutate(payload, {
      onSuccess: () => {
        setFormValue(initialValue)
      },
    })
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Company Payment
      </Heading>

      <Divider />

      <Form
        ref={formRef}
        model={FormModel}
        formValue={formValue}
        onChange={(value) => setFormValue(value as FormValue)}
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Stack fluid>
            <Form.Group controlId="company">
              <Form.Label>Company</Form.Label>

              <Form.Control
                name="company"
                accepter={SelectPicker}
                loading={companiesLoading}
                data={companyData}
                searchable
                block
              />
            </Form.Group>
          </Form.Stack>
          <Form.Stack fluid>
            <Form.Group>
              <Form.Label>Payable Amount</Form.Label>

              <Form.Control
                name="payableAmount"
                readOnly
                value={formValue.payableAmount.toLocaleString()}
              />
            </Form.Group>
          </Form.Stack>
          <Form.Stack fluid>
            <Form.Group controlId="paymentMethod">
              <Form.Label>Payment Method</Form.Label>

              <Form.Control
                name="paymentMethod"
                loading={paymentMethodsLoading}
                accepter={SelectPicker}
                data={paymentMethodData}
                searchable={false}
                block
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group>
              <Form.Label>Account Balance</Form.Label>

              <Form.Control
                name="accountBalance"
                readOnly
                value={accountBalance.toLocaleString()}
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="paymentAmount">
              <Form.Label>Payment Amount</Form.Label>

              <Form.Control
                name="paymentAmount"
                accepter={NumberInput}
                min={1}
                max={formValue.accountBalance}
                formatter={(value) => (value ? Number(value).toLocaleString() : '')}
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
          <Form.Stack fluid className="col-span-1 md:col-span-2">
            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>

              <Form.Control
                placeholder="(optional)"
                name="remarks"
                accepter={Textarea}
                rows={1}
                cols={2}
              />
            </Form.Group>
          </Form.Stack>
        </div>

        <Form.Group className="mt-5 flex justify-end">
          <Button
            loading={isPending}
            disabled={isPending}
            appearance="primary"
            type="submit"
            startIcon={<Icon as={MdPayment} />}
          >
            Payment
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Page
