'use client'
import Textarea from '@/components/Textarea'
import { useEffect, useMemo, useState } from 'react'
import {
  Form,
  Button,
  Heading,
  Schema,
  Divider,
  SelectPicker,
  InputNumber,
  DateInput,
  DatePicker,
} from 'rsuite'
import { countries } from 'country-data-list'
import moment from 'moment'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { Icon } from '@rsuite/icons'
const { StringType, NumberType, DateType } = Schema.Types

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
  company: StringType().isRequired('Company name is required.'),
  amount: NumberType().isRequired('Amount is required.'),
  confirmAmount: NumberType()
    .isRequired('Confirm amount is required.')
    .equalTo('amount', 'Amounts do not match.'),
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

// 🧩 Initial values
const initialValue = {
  salesType: 'Ticket',
  company: '',
  amount: null,
  confirmAmount: null,
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
    // 🧩 Destructure common fields
    const { salesType, company, amount, passport, remarks, ...rest } = formValue

    //  🧩 Extra details structure based on selectedType
    const details = getExtraValue(selectedType)
    const filledDetails: Partial<typeof details> = {}

    //  🧩 Filter and assign only non-empty values
    for (const key of Object.keys(details) as (keyof typeof details)[]) {
      const value = rest[key]

      //  🧩 Filter out empty values
      if (value !== undefined && value !== null && value !== '') {
        filledDetails[key] = (value instanceof Date ? value.toISOString() : value) as never
      }
    }

    // final formatted data
    const formattedData = {
      type: salesType,
      company,
      remarks,
      passport,
      amount,
      details: filledDetails,
    }

    console.log('✅ Final Submit Data:', formattedData)

    setFormValue({ ...initialValue, salesType, ...getExtraValue(selectedType) })
  }

  // 🧩 Sales type data
  const salesTypeData = salesTypes.map((item) => ({ label: item, value: item }))

  // 🧩 visa type data
  const visaTypeData = visaTypes
    .sort((a, b) => a.localeCompare(b))
    .map((item) => ({ label: item, value: item }))

  // 🧩 Country data for visit visa and employment visa
  const countryData = countries.all
    .filter((item) => item.emoji && !['Israel', 'India'].includes(item.name))
    .map((item) => ({
      label: `${item.emoji} ${item.name}`,
      value: item.alpha2,
    }))

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Sales Info
      </Heading>
      <Divider />
      <Form
        fluid
        model={schema}
        formValue={formValue}
        onChange={(value) => setFormValue(value as typeof formValue)}
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2">
          {/* Common fields */}
          <Form.Group controlId="salesType">
            <Form.ControlLabel>Sales Type</Form.ControlLabel>
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

          <Form.Group controlId="company">
            <Form.ControlLabel>Company</Form.ControlLabel>
            <Form.Control name="company" accepter={SelectPicker} data={salesTypeData} block />
          </Form.Group>

          <Form.Group controlId="amount">
            <Form.ControlLabel>Amount</Form.ControlLabel>
            <Form.Control name="amount" accepter={InputNumber} min={0} />
          </Form.Group>

          <Form.Group controlId="confirmAmount">
            <Form.ControlLabel>Confirm Amount</Form.ControlLabel>
            <Form.Control name="confirmAmount" accepter={InputNumber} min={0} />
          </Form.Group>

          <Form.Group controlId="passport">
            <Form.ControlLabel>Passport</Form.ControlLabel>
            <Form.Control name="passport" accepter={SelectPicker} data={salesTypeData} block />
          </Form.Group>

          {/* 🎯 Ticket fields */}
          {selectedType === 'Ticket' && (
            <>
              <Form.Group controlId="ticketNumber">
                <Form.ControlLabel>Ticket Number</Form.ControlLabel>
                <Form.Control name="ticketNumber" />
              </Form.Group>

              <Form.Group controlId="ticketIssueDate">
                <Form.ControlLabel>Ticket Issue Date</Form.ControlLabel>
                <Form.Control name="ticketIssueDate" accepter={DateInput} format="dd/MMM/yyyy" />
              </Form.Group>

              <Form.Group controlId="sector">
                <Form.ControlLabel>Sector</Form.ControlLabel>
                <Form.Control name="sector" />
              </Form.Group>

              <Form.Group controlId="pnr">
                <Form.ControlLabel>PNR</Form.ControlLabel>
                <Form.Control name="pnr" />
              </Form.Group>

              <Form.Group controlId="air">
                <Form.ControlLabel>Air</Form.ControlLabel>
                <Form.Control name="air" />
              </Form.Group>

              <Form.Group controlId="flightDate">
                <Form.ControlLabel>Flight Date</Form.ControlLabel>
                <Form.Control
                  name="flightDate"
                  accepter={DatePicker}
                  editable={false}
                  format="dd/MMM/yyyy hh:mm"
                  hideMinutes={(minute) => minute % 5 !== 0}
                  shouldDisableDate={(date) => moment(date).isBefore(moment().startOf('day'))}
                  placement="topStart"
                  block
                />
              </Form.Group>
            </>
          )}

          {/* 🎯 Visit Visa fields */}
          {selectedType === 'Visa' && (
            <>
              <Form.Group controlId="country">
                <Form.ControlLabel>Country</Form.ControlLabel>
                <Form.Control
                  name="country"
                  accepter={SelectPicker}
                  data={countryData}
                  block
                  placement="bottom"
                  virtualized
                />
              </Form.Group>
              <Form.Group controlId="visaType">
                <Form.ControlLabel>Visa Type</Form.ControlLabel>
                <Form.Control
                  name="visaType"
                  accepter={SelectPicker}
                  data={visaTypeData}
                  searchable={false}
                  block
                  placement="top"
                />
              </Form.Group>
            </>
          )}

          <Form.Group controlId="remarks">
            <Form.ControlLabel>Remarks</Form.ControlLabel>
            <Form.Control name="remarks" accepter={Textarea} rows={1} />
          </Form.Group>
        </div>

        <Form.Group className="mt-5 flex justify-end">
          <Button startIcon={<Icon as={IoMdAddCircleOutline} />} appearance="primary" type="submit">
            Add
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Page
