import { useCompanyBalance, useSearchCompanies } from '@/hooks/useCompany'
import { usePaymentMethods, useReceivePayment } from '@/hooks/useTransaction'
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

// ================= Validation =================

const FormModel = SchemaModel({
  company: StringType().isRequired('Company is required.'),

  receiveAmount: NumberType().isRequired('Receive amount is required.'),

  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('receiveAmount', "Amount doesn't match."),

  receiverAccount: StringType().isRequired('Receiver account is required.'),

  remarks: StringType(),
})

// ================= Initial Value =================

const initialValue = {
  company: null as string | null,
  dueAmount: 0,
  receiveAmount: null as number | null,
  confirmAmount: null as number | null,
  receiverAccount: null as string | null,
  remarks: '',
}

type FormValue = typeof initialValue

const Page = () => {
  // HOOKS
  const { mutate: receivePaymentMutate, isPending } = useReceivePayment()
  // ================= Form =================

  const formRef = useRef<FormInstance>(null)
  // ================= Queries =================

  const { data: companiesRes, isLoading: companiesLoading } = useSearchCompanies()

  const { data: paymentMethodsRes, isLoading: paymentMethodsLoading } = usePaymentMethods()

  // ================= State =================

  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  const selectedCompanyId = formValue.company ? Number(formValue.company) : 0

  const { data: companyBalanceRes } = useCompanyBalance(selectedCompanyId)

  // ================= Select Data =================

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

  // ================= Update Due Amount =================

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      dueAmount: companyBalanceRes?.balance ?? 0,
      receiveAmount: null,
      confirmAmount: null,
    }))
  }, [companyBalanceRes?.balance])

  // ================= Submit =================

  const handleFormSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return

    const payload = {
      companyId: Number(formValue.company),
      receiveAmount: Number(formValue.receiveAmount),
      receiverAccountId: Number(formValue.receiverAccount),
      remarks: formValue.remarks.trim(),
    }

    receivePaymentMutate(payload, {
      onSuccess: () => {
        setFormValue(initialValue)
      },
    })
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Receive Payment Info
      </Heading>

      <Divider />

      <Form
        model={FormModel}
        formValue={formValue}
        onChange={(value) => setFormValue(value as FormValue)}
        onSubmit={handleFormSubmit}
        ref={formRef}
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
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group>
              <Form.Label>Due Amount</Form.Label>

              <Form.Control
                name="dueAmount"
                readOnly
                value={formValue.dueAmount.toLocaleString()}
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="receiveAmount">
              <Form.Label>Receive Amount</Form.Label>

              <Form.Control
                name="receiveAmount"
                accepter={NumberInput}
                min={0}
                errorPlacement="bottomEnd"
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
                errorPlacement="bottomEnd"
                formatter={(value) => (value ? Number(value).toLocaleString() : '')}
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="receiverAccount">
              <Form.Label>Receiver Account</Form.Label>

              <Form.Control
                name="receiverAccount"
                accepter={SelectPicker}
                data={paymentMethodData}
                searchable={false}
                loading={paymentMethodsLoading}
                block
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>

              <Form.Control placeholder="(optional)" name="remarks" accepter={Textarea} rows={1} />
            </Form.Group>
          </Form.Stack>
        </div>

        <Form.Group className="mt-5 flex justify-end">
          <Button
            disabled={isPending}
            loading={isPending}
            appearance="primary"
            type="submit"
            startIcon={<Icon as={MdPayment} />}
          >
            Receive
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Page
