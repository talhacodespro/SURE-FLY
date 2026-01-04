import { useEffect, useMemo, useState, useRef } from 'react'
import {
  Form,
  Button,
  Heading,
  Schema,
  Divider,
  SelectPicker,
  NumberInput,
  DateInput,
  DatePicker,
  Textarea,
  StringType,
  NumberType,
  DateType,
  toaster,
  Message,
} from 'rsuite'
import { Icon } from '@rsuite/icons'
import { IoMdSave, IoMdClose } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router'
import type { FormInstance } from 'rsuite'
import { countries } from 'country-data-list'
import moment from 'moment'

const salesTypes = ['Ticket', 'Visa'] as const
type SalesType = (typeof salesTypes)[number]

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

const baseModel = {
  salesType: StringType().isRequired('Sales type is required.'),
  purchaseFrom: StringType().isRequired('Purchase from is required.'),
  purchaseAmount: NumberType().isRequired('Purchase amount is required.'),
  company: StringType().isRequired('Company name is required.'),
  amount: NumberType().isRequired('Amount is required.'),
  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('amount', 'Amounts do not match.'),
  confirmPurchaseAmount: NumberType()
    .equalTo('purchaseAmount', 'Purchase amounts do not match.')
    .isRequired('Confirm amount is required.'),
  passport: StringType().isRequired('Passport name is required.'),
  remarks: StringType().isRequired('Remarks is required.'),
}

const getExtraModel = (type: SalesType) => {
  switch (type) {
    case 'Ticket':
      return {
        ticketNumber: NumberType().isRequired('Ticket number is required.'),
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

const initialValue = {
  salesType: 'Ticket',
  purchaseFrom: '',
  purchaseAmount: null as number | null,
  company: '',
  amount: null as number | null,
  confirmAmount: null as number | null,
  confirmPurchaseAmount: null as number | null,
  passport: '',
  remarks: '',
  ticketNumber: '',
  sector: '',
  ticketIssueDate: null as Date | null,
  pnr: '',
  air: '',
  flightDate: null as Date | null,
  country: '',
  visaType: '',
}

type FormValue = typeof initialValue

const Page = () => {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: Partial<FormValue> }

  const initialType = (state?.salesType as SalesType) || 'Ticket'
  const [selectedType, setSelectedType] = useState<SalesType>(initialType)
  const [formValue, setFormValue] = useState<FormValue>({
    ...initialValue,
    salesType: initialType,
    ...state,
  })

  const schema = useMemo(() => {
    return Schema.Model({
      ...baseModel,
      ...getExtraModel(selectedType),
    })
  }, [selectedType])

  const formRef = useRef<FormInstance>(null)

  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return
    toaster.push(<Message type="success">Sales updated</Message>, { placement: 'bottomEnd' })
    navigate('/list-sales')
  }

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
        value: item.alpha2,
      }))
  }, [])
  const companyData = useMemo(
    () => [
      { label: 'SURE FLY LTD', value: 'SURE FLY LTD' },
      { label: 'Jane', value: 'Jane' },
    ],
    [],
  )
  const purchaseFromData = useMemo(
    () => [
      { label: 'SURE FLY LTD', value: 'SURE FLY LTD' },
      { label: 'Jane', value: 'Jane' },
    ],
    [],
  )
  const passportData = useMemo(
    () => [
      { label: 'John (A15858199)', value: 'A15858199' },
      { label: 'Jane (Doe)', value: 'Doe' },
    ],
    [],
  )

  const getExtraValue = (type: SalesType) => {
    switch (type) {
      case 'Ticket':
        return {
          ticketNumber: '',
          sector: '',
          ticketIssueDate: null as Date | null,
          pnr: '',
          air: '',
          flightDate: null as Date | null,
          country: '',
          visaType: '',
        }
      case 'Visa':
        return {
          ticketNumber: '',
          sector: '',
          ticketIssueDate: null as Date | null,
          pnr: '',
          air: '',
          flightDate: null as Date | null,
          country: '',
          visaType: '',
        }
      default:
        return {}
    }
  }

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      salesType: selectedType,
      ...getExtraValue(selectedType),
    }))
  }, [selectedType])

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
        onChange={(value) => setFormValue(value as FormValue)}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
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
                onChange={(val) => setSelectedType(val)}
              />
            </Form.Group>
          </Form.Stack>

          <Form.Stack fluid>
            <Form.Group controlId="purchaseFrom">
              <Form.Label>Purchase From</Form.Label>
              <Form.Control
                name="purchaseFrom"
                accepter={SelectPicker}
                data={purchaseFromData}
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

          <Form.Stack fluid className="md:col-span-2">
            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control name="remarks" accepter={Textarea} rows={1} />
            </Form.Group>
          </Form.Stack>

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
                    format="dd/MMM/yyyy"
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
                    format="dd/MMM/yyyy hh:mm"
                    shouldDisableDate={(date) => moment(date).isBefore(moment().startOf('day'))}
                    placement="topStart"
                    errorPlacement="bottomEnd"
                    block
                  />
                </Form.Group>
              </Form.Stack>
            </>
          )}

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
            onClick={() => navigate('/list-sales')}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Page
