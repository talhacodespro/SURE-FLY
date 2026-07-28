import { useEffect, useMemo, useState, useRef } from 'react'
import {
  Form,
  Button,
  Heading,
  Schema,
  Divider,
  SelectPicker,
  NumberInput,
  DatePicker,
  Textarea,
  StringType,
  NumberType,
  DateType,
  DateInput,
} from 'rsuite'
import { Icon } from '@rsuite/icons'
import { IoMdSave, IoMdClose } from 'react-icons/io'
import { useLocation, useNavigate, useParams } from 'react-router'
import type { FormInstance } from 'rsuite'
import { countries } from 'country-data-list'
import { useSearchCompanies } from '@/hooks/useCompany'
import { useSearchPassports } from '@/hooks/usePassport'
import { useSale, useUpdateSale } from '@/hooks/useSales'
import type { UpdateSalePayload } from '@/lib/api/sales'

// ========== Sales Types ==========
const salesTypes = ['Ticket', 'Visa'] as const
type SalesType = (typeof salesTypes)[number]

// ========== Visa Types ==========
const visaTypes = [
  'Tourist Visa',
  'Business Visa',
  'Student Visa',
  'Work Visa',
  'Transit Visa',
  'Medical Visa',
  'Family Visit Visa',
  'Immigration Visa',
  'Diplomatic Visa',
  'Journalist Visa',
  'Cultural Exchange Visa',
  'Religious Visa',
  'Investor Visa',
  'Permanent Resident Visa',
  'Spousal / Marriage Visa',
  'Au Pair Visa',
  'Retirement Visa',
  'Conference Visa',
  'Training Visa',
  'Internship Visa',
  'Humanitarian Visa',
  'Refugee Visa',
  'Umrah Visa',
  'Hajj Visa',
]

// ========== Base Validation Model ==========
const baseModel = {
  salesType: StringType().isRequired('Sales type is required.'),
  purchaseFrom: StringType().isRequired('Purchase from is required.'),
  purchaseAmount: NumberType().isRequired('Purchase amount is required.'),
  confirmPurchaseAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('purchaseAmount', 'Purchase amounts do not match.'),
  company: StringType()
    .isRequired('Company name is required.')
    .addRule((value, data) => {
      if (value === data.purchaseFrom) {
        return false
      }
      return true
    }, 'Purchase from and Company cannot be same.'),
  amount: NumberType().isRequired('Amount is required.'),
  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('amount', 'Amounts do not match.'),
  passport: StringType().isRequired('Passport name is required.'),
  remarks: StringType(),
}

// ========== Extra Validation Model (Per Sales Type) ==========
const getExtraModel = (type: SalesType) => {
  switch (type) {
    case 'Ticket':
      return {
        ticketNumber: StringType().isRequired('Ticket number is required.'),
        sector: StringType().isRequired('Sector is required.'),
        ticketIssueDate: DateType().isRequired('Ticket issue date is required.'),
        pnr: StringType().isRequired('PNR is required.'),
        air: StringType().isRequired('Air is required.'),
        flightDate: DateType().isRequired('Flight date is required.'),
      }
    case 'Visa':
      return {
        country: StringType().isRequired('Country is required.'),
        visaType: StringType().isRequired('Visa type is required.'),
      }
    default:
      return {}
  }
}

// ========== Initial Form Value ==========
const initialValue = {
  salesType: 'Ticket' as SalesType,
  purchaseFrom: '',
  purchaseAmount: undefined as number | undefined,
  confirmPurchaseAmount: undefined as number | undefined,
  company: '',
  amount: undefined as number | undefined,
  confirmAmount: undefined as number | undefined,
  passport: '',
  remarks: '',
  ticketNumber: '',
  sector: '',
  ticketIssueDate: undefined as Date | undefined,
  pnr: '',
  air: '',
  flightDate: undefined as Date | undefined,
  country: '',
  visaType: '',
}

type FormValue = typeof initialValue

// ========== Edit Sales Page Component ==========
const Page = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const formRef = useRef<FormInstance>(null)

  // ========== Hooks ==========
  const { data: companiesRes } = useSearchCompanies()
  const { data: passportsRes } = useSearchPassports()
  const { data: saleData, isLoading: isFetchingSale } = useSale(Number(id))
  const { mutate: updateSale, isPending: isUpdating } = useUpdateSale()

  const [selectedType, setSelectedType] = useState<SalesType>('Ticket')
  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  // ========== Load Data Into Form ==========
  useEffect(() => {
    const data = state || saleData
    if (data) {
      const type = (data.type?.charAt(0) + data.type?.slice(1).toLowerCase()) as SalesType
      setSelectedType(type)
      setFormValue({
        salesType: type,
        purchaseFrom: String(data.purchaseFromId || data.purchaseFrom?.id || ''),
        purchaseAmount: Number(data.purchaseAmount),
        confirmPurchaseAmount: Number(data.purchaseAmount),
        company: String(data.companyId || data.company?.id || ''),
        amount: Number(data.companyAmount || data.amount),
        confirmAmount: Number(data.companyAmount || data.amount),
        passport: String(data.passportId || data.passport?.id || ''),
        remarks: data.remarks || '',
        ticketNumber: data.ticket?.ticketNo || '',
        sector: data.ticket?.sector || '',
        ticketIssueDate: data.ticket?.issueDate ? new Date(data.ticket.issueDate) : undefined,
        pnr: data.ticket?.pnr || '',
        air: data.ticket?.air || '',
        flightDate: data.ticket?.flightDate ? new Date(data.ticket.flightDate) : undefined,
        country: data.visa?.country || '',
        visaType: data.visa?.visaType || '',
      })
    }
  }, [saleData, state])

  // ========== Merge Base and Extra Validation ==========
  const schema = useMemo(() => {
    return Schema.Model({
      ...baseModel,
      ...getExtraModel(selectedType),
    })
  }, [selectedType])

  // ========== Handle Form Submit ==========
  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return

    const {
      salesType,
      purchaseFrom,
      purchaseAmount,
      company,
      amount,
      passport,
      remarks,
      ticketNumber,
      ticketIssueDate,
      sector,
      pnr,
      air,
      flightDate,
      country,
      visaType,
    } = formValue

    const payload: UpdateSalePayload = {
      type: salesType.toUpperCase() as 'TICKET' | 'VISA',
      purchaseAmount: Number(purchaseAmount),
      companyAmount: Number(amount),
      remarks,
      passportId: Number(passport),
      companyId: Number(company),
      purchaseFromId: Number(purchaseFrom),
    }

    if (salesType === 'Ticket') {
      payload.ticket = {
        ticketNo: ticketNumber,
        issueDate: ticketIssueDate!,
        sector,
        pnr,
        air,
        flightDate: flightDate!,
      }
    } else if (salesType === 'Visa') {
      payload.visa = {
        country,
        visaType,
      }
    }

    updateSale({ id: Number(id), payload })
  }

  // ========== Selector Data ==========
  const salesTypeData = salesTypes.map((item) => ({ label: item, value: item }))

  const visaTypeData = useMemo(() => {
    return visaTypes
      .sort((a, b) => a.localeCompare(b))
      .map((item) => ({ label: item, value: item }))
  }, [])

  const countryData = useMemo(() => {
    return countries.all
      .filter((item) => item.emoji && !['Israel', 'India'].includes(item.name))
      .map((item) => ({
        label: `${item.emoji} ${item.name}`,
        value: item.name,
      }))
  }, [])

  const companyData = useMemo(() => {
    return (companiesRes?.data || []).map((item) => ({
      label: item.name,
      value: String(item.id),
    }))
  }, [companiesRes])

  const passportData = useMemo(() => {
    return (passportsRes?.data || []).map((item) => ({
      label: `${item.fullName} • ${item.passportNo}`,
      value: String(item.id),
    }))
  }, [passportsRes])

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Edit Sales
      </Heading>
      <Divider />
      <Form
        ref={formRef}
        model={schema}
        formValue={formValue}
        onChange={(value) => {
          // Normalize number inputs to ensure NumberType().equalTo works correctly
          const normalized: FormValue = {
            ...value,
            purchaseAmount: Number(value.purchaseAmount),
            confirmPurchaseAmount: Number(value.confirmPurchaseAmount),
            amount: Number(value.amount),
            confirmAmount: Number(value.confirmAmount),
          } as FormValue
          setFormValue(normalized)
        }}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
          {/* ========== Common Fields ========== */}
          <Form.Stack fluid>
            <Form.Group controlId="salesType">
              <Form.Label>Sales Type</Form.Label>
              <Form.Control
                name="salesType"
                accepter={SelectPicker}
                data={salesTypeData}
                cleanable={false}
                searchable={false}
                block
                readOnly={true}
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="purchaseFrom">
              <Form.Label>Purchase From</Form.Label>
              <Form.Control
                name="purchaseFrom"
                accepter={SelectPicker}
                data={companyData}
                block
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="purchaseAmount">
              <Form.Label>Purchase Amount</Form.Label>
              <Form.Control
                name="purchaseAmount"
                accepter={NumberInput}
                min={0}
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="confirmPurchaseAmount">
              <Form.Label>Confirm Amount</Form.Label>
              <Form.Control
                name="confirmPurchaseAmount"
                accepter={NumberInput}
                min={0}
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="passport">
              <Form.Label>Passport</Form.Label>
              <Form.Control
                name="passport"
                accepter={SelectPicker}
                data={passportData}
                block
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="company">
              <Form.Label>Company</Form.Label>
              <Form.Control
                name="company"
                accepter={SelectPicker}
                data={companyData}
                block
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                accepter={NumberInput}
                min={0}
                errorPlacement="bottomEnd"
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
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid className="md:col-span-2">
            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control placeholder="(optional)" name="remarks" accepter={Textarea} rows={1} />
            </Form.Group>
          </Form.Stack>

          {/* ========== Type Specific Fields (Ticket) ========== */}
          {selectedType === 'Ticket' && (
            <>
              <Form.Stack fluid>
                <Form.Group controlId="ticketNumber">
                  <Form.Label>Ticket Number</Form.Label>
                  <Form.Control name="ticketNumber" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="sector">
                  <Form.Label>Sector</Form.Label>
                  <Form.Control name="sector" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="ticketIssueDate">
                  <Form.Label>Ticket Issue Date</Form.Label>
                  <Form.Control
                    name="ticketIssueDate"
                    accepter={DateInput}
                    format="dd-MM-yyyy"
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="pnr">
                  <Form.Label>PNR</Form.Label>
                  <Form.Control name="pnr" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="air">
                  <Form.Label>Air</Form.Label>
                  <Form.Control name="air" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="flightDate">
                  <Form.Label>Flight Date</Form.Label>
                  <Form.Control
                    name="flightDate"
                    accepter={DatePicker}
                    editable={false}
                    format="dd-MM-yyyy HH:mm"
                    placement="topStart"
                    errorPlacement="bottomEnd"
                    block
                  />
                </Form.Group>
              </Form.Stack>
            </>
          )}

          {/* ========== Type Specific Fields (Visa) ========== */}
          {selectedType === 'Visa' && (
            <>
              <Form.Stack fluid>
                <Form.Group controlId="country">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    name="country"
                    accepter={SelectPicker}
                    data={countryData}
                    block
                    placement="bottom"
                    virtualized
                    errorPlacement="bottomEnd"
                  />
                </Form.Group>
              </Form.Stack>
              <Form.Stack fluid>
                <Form.Group controlId="visaType">
                  <Form.Label>Visa Type</Form.Label>
                  <Form.Control
                    name="visaType"
                    accepter={SelectPicker}
                    data={visaTypeData}
                    searchable={false}
                    block
                    placement="top"
                  />
                </Form.Group>
              </Form.Stack>
            </>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="subtle"
            type="button"
            onClick={() => navigate('/list-sales')}
          >
            Cancel
          </Button>
          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            type="submit"
            loading={isUpdating || isFetchingSale}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Page
