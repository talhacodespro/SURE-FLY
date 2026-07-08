import { useCompanyBalance, useSearchCompanies } from '@/hooks/useCompany'
import { usePaymentMethods } from '@/hooks/useTransaction'
import { Icon } from '@rsuite/icons'
import { useEffect, useMemo, useState } from 'react'
import { MdPayment } from 'react-icons/md'
import { Form, Button, Heading, Divider, Textarea, SelectPicker, NumberInput } from 'rsuite'
import { NumberType, SchemaModel, StringType } from 'rsuite/Schema'

// ================= Validation =================

const FormModel = SchemaModel({
  company: StringType().isRequired('Company is required.'),

  receiveAmount: NumberType().isRequired('Receive amount is required.'),

  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('receiveAmount', "Amount doesn't match."),

  receiverAccount: StringType().isRequired('Receiver account is required.'),

  remarks: StringType().isRequired('Remark is required.'),
})

// ================= Initial Value =================

const initialValue = {
  company: '',
  dueAmount: 0,
  receiveAmount: null as number | null,
  confirmAmount: null as number | null,
  receiverAccount: '',
  remarks: '',
}

type FormValue = typeof initialValue

const Page = () => {
  // ================= Queries =================

  const { data: companiesRes, isLoading: companiesLoading } = useSearchCompanies()

  const { data: paymentMethodsRes } = usePaymentMethods()

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
    console.log(formValue)

    setFormValue(initialValue)
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
                block
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
          <Button appearance="primary" type="submit" startIcon={<Icon as={MdPayment} />}>
            Receive
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Page
