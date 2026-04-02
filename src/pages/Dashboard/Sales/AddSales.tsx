import { useEffect, useMemo, useState } from 'react'
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
} from 'rsuite'
import { countries } from 'country-data-list'
import moment from 'moment'
import { IoMdAdd } from 'react-icons/io'
import { Icon } from '@rsuite/icons'

// Sales types
const salesTypes = ['Ticket', 'Visa'] as const
type SalesType = (typeof salesTypes)[number]

// 🧩 Visa types
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

// 🧩 Base validation model
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

// 🧩 Extra validation model (per type)
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

// 🧩 Extra field keys (for identification)
const getExtraFieldKeys = (type: SalesType): string[] => {
  switch (type) {
    case 'Ticket':
      return ['ticketNumber', 'sector', 'ticketIssueDate', 'pnr', 'air', 'flightDate']
    case 'Visa':
      return ['country', 'visaType']
    default:
      return []
  }
}

// 🧩 Initial values
const initialValue = {
  salesType: 'Ticket',
  purchaseFrom: '',
  purchaseAmount: null,
  company: '',
  amount: null,
  confirmAmount: null,
  confirmPurchaseAmount: null,
  passport: '',
  remarks: '',

  // Ticket fields
  ticketNumber: '',
  sector: '',
  ticketIssueDate: null,
  pnr: '',
  air: '',
  flightDate: null,

  // Visa fields
  country: '',
  visaType: '',
}

// 🧩 Extra values
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
      }
    case 'Visa':
      return {
        country: '',
        visaType: '',
      }
    default:
      return {}
  }
}

const Page = () => {
  const [selectedType, setSelectedType] = useState<SalesType>('Ticket')

  const [formValue, setFormValue] = useState({
    ...initialValue,
    ...getExtraValue(selectedType),
  })

  // 🔄 Reset form when type changes
  useEffect(() => {
    setFormValue({
      ...initialValue,
      salesType: selectedType,
      ...getExtraValue(selectedType),
    })
  }, [selectedType])

  // Merge base and extra validation
  const schema = useMemo(() => {
    return Schema.Model({
      ...baseModel,
      ...getExtraModel(selectedType),
    })
  }, [selectedType])

  const handleFormSubmit = () => {
    const { salesType, ...rest } = formValue

    // Get extra field keys for current type
    const extraFieldKeys = getExtraFieldKeys(selectedType)

    // Separate extra details from common fields
    const details: Record<string, string | Date> = {}
    const commonFields: Record<string, unknown> = {}

    // Filter fields based on extra field keys
    Object.keys(rest).forEach((key) => {
      const value = rest[key as keyof typeof rest]

      if (extraFieldKeys.includes(key)) {
        // This is an extra detail field
        // Filter out empty values
        if (value !== undefined && value !== null && value !== '') {
          details[key] = value instanceof Date ? value.toISOString() : value
        }
      } else {
        // This is a common field
        if (value !== undefined && value !== null && value !== '') {
          commonFields[key] = value
        }
      }
    })

    const finalData = {
      salesType,
      details,
      ...commonFields,
    }

    // Reset form after successful submission (optional)
    setFormValue({
      ...initialValue,
      salesType: selectedType,
      ...getExtraValue(selectedType),
    })
    console.log('Final formatted data:', finalData)
  }

  // 🧩 Sales type data
  const salesTypeData = salesTypes.map((item) => ({ label: item, value: item }))

  // 🧩 visa type data
  const visaTypeData = useMemo(() => {
    return visaTypes
      .sort((a, b) => a.localeCompare(b))
      .map((item) => ({ label: item, value: item }))
  }, [])

  // 🧩 Country data for visit visa and employment visa
  const countryData = useMemo(() => {
    return countries.all
      .filter((item) => item.emoji && !['Israel', 'India'].includes(item.name))
      .map((item) => ({
        label: `${item.emoji} ${item.name}`,
        value: item.alpha2,
      }))
  }, [])

  const purchaseFromData = useMemo(
    () => [
      { label: 'SURE FLY LTD', value: 'SURE FLY LTD' },
      { label: 'Jane', value: 'Jane' },
    ],
    [],
  )

  const companyData = useMemo(
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

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Sales Info
      </Heading>
      <Divider />
      <Form
        model={schema}
        formValue={formValue}
        onChange={(value) => setFormValue(value as typeof formValue)}
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
          {/* Common fields */}
          <Form.Stack fluid>
            <Form.Group controlId="salesType">
              <Form.Label>Sales Type</Form.Label>
              <Form.Control
                name="salesType"
                accepter={SelectPicker}
                data={salesTypeData}
                cleanable={false}
                searchable={false}
                onChange={(val) => setSelectedType(val)}
                block
                className="cursor-pointer"
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
              <Form.Label>Company Amount</Form.Label>
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

          {/* 🎯 Ticket fields */}
          {selectedType === 'Ticket' && (
            <>
              <Form.Stack fluid>
                <Form.Group controlId="ticketNumber">
                  <Form.Label>Ticket Number</Form.Label>
                  <Form.Control name="ticketNumber" errorPlacement="bottomEnd" />
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
                <Form.Group controlId="sector">
                  <Form.Label>Sector</Form.Label>
                  <Form.Control name="sector" errorPlacement="bottomEnd" />
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
                    block
                  />
                </Form.Group>
              </Form.Stack>
            </>
          )}

          {/* 🎯 Visit Visa fields */}
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

          <Form.Stack fluid className="col-span-1 md:col-span-2">
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
  )
}

export default Page
