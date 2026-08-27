/**
 * Edit passport page.
 * Loads one passport, fills the form, and submits updates.
 */

import { Icon } from '@rsuite/icons'
import { countries } from 'country-data-list'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IoMdClose, IoMdSave } from 'react-icons/io'
import { Button, DateInput, Divider, Form, Heading, SelectPicker, Textarea } from 'rsuite'
import { DateType, SchemaModel, StringType } from 'rsuite/Schema'
import type { FormInstance } from 'rsuite'

import { useLocation, useNavigate, useParams } from 'react-router'

import { usePassport, useUpdatePassport } from '@/hooks/usePassport'

import { useAgents } from '@/hooks/useAgent'

import type { MaritalStatus, Passport, UpdatePassportPayload } from '@/lib/api/passport'

/* =========================================
   Validation Model
========================================= */

const FormModel = SchemaModel({
  agentId: StringType().isRequired('Agent is required.'),

  fullName: StringType().isRequired('Passport name is required.'),

  passportNo: StringType().isRequired('Passport number is required.'),

  dob: DateType().isRequired('Date of birth is required.'),

  nid: StringType().isRequired('NID is required.'),

  issueDate: DateType().isRequired('Issue date is required.'),

  expiryDate: DateType().isRequired('Passport expire date is required.'),

  phone: StringType().isRequired('Mobile is required.'),

  whatsapp: StringType().isRequired('WhatsApp is required.'),

  fatherName: StringType().isRequired('Father name is required.'),

  fatherNid: StringType(),

  motherName: StringType().isRequired('Mother name is required.'),

  motherNid: StringType(),

  country: StringType().isRequired('Country is required.'),

  maritalStatus: StringType().isRequired('Marital status is required.'),

  spouseName: StringType().addRule(
    (value, data) => {
      if (data.maritalStatus !== 'MARRIED') {
        return true
      }

      return Boolean(value?.trim())
    },
    'Spouse name is required.',
    true,
  ),

  spouseNid: StringType().addRule(
    (value, data) => {
      if (data.maritalStatus !== 'MARRIED') {
        return true
      }

      return Boolean(value?.trim())
    },
    'Spouse NID is required.',
    true,
  ),

  email: StringType().isEmail('Please enter a valid email address.'),

  remarks: StringType(),
})

/* =========================================
   Form Value
========================================= */

type FormValue = {
  agentId: string

  fullName: string
  passportNo: string

  dob: Date | null

  nid: string

  issueDate: Date | null
  expiryDate: Date | null

  phone: string
  whatsapp: string

  fatherName: string
  fatherNid: string

  motherName: string
  motherNid: string

  country: string

  maritalStatus: MaritalStatus | ''

  spouseName: string
  spouseNid: string

  email: string
  remarks: string
}

/* =========================================
   Initial Value
========================================= */

const initialValue: FormValue = {
  agentId: '',

  fullName: '',
  passportNo: '',

  dob: null,

  nid: '',

  issueDate: null,
  expiryDate: null,

  phone: '',
  whatsapp: '',

  fatherName: '',
  fatherNid: '',

  motherName: '',
  motherNid: '',

  country: '',

  maritalStatus: '',

  spouseName: '',
  spouseNid: '',

  email: '',
  remarks: '',
}

/* =========================================
   Marital Status
========================================= */

const maritalStatusData = [
  {
    label: 'Married',
    value: 'MARRIED',
  },
  {
    label: 'Unmarried',
    value: 'UNMARRIED',
  },
]

/* =========================================
   Parse Date
========================================= */

const parseDate = (value: unknown): Date | null => {
  if (!value) return null

  if (value instanceof Date) {
    return value
  }

  if (typeof value === 'string') {
    const date = new Date(value)

    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

/* =========================================
   Page
========================================= */

const Page = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const { state } = useLocation() as {
    state?: Partial<Passport>
  }

  const passportId = Number(id)

  const formRef = useRef<FormInstance>(null)

  /* =========================================
     State
  ========================================= */

  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  /* =========================================
     Hooks
  ========================================= */

  const { data: passport, isLoading: isFetching } = usePassport(
    passportId,
    Boolean(passportId) && !state,
  )

  const { mutate: updatePassport, isPending: isUpdating } = useUpdatePassport()

  const { data: agentsRes, isLoading: isAgentsLoading } = useAgents()

  /* =========================================
     Agent Picker
  ========================================= */

  const agentData = useMemo(() => {
    const agents = agentsRes?.data ?? []

    return agents.map((agent) => ({
      label: agent.name,
      value: String(agent.id),
    }))
  }, [agentsRes])

  /* =========================================
     Country Picker
  ========================================= */

  const countryData = useMemo(() => {
    return countries.all
      .filter((item) => item.emoji && !['Israel', 'India'].includes(item.name))
      .map((item) => ({
        label: `${item.emoji} ${item.name}`,
        value: item.name,
      }))
  }, [])

  /* =========================================
     Load Passport Data
  ========================================= */

  useEffect(() => {
    const data = state || passport

    if (!data) return

    setFormValue({
      agentId: data.agentId != null ? String(data.agentId) : '',

      fullName: String(data.fullName || ''),

      passportNo: String(data.passportNo || ''),

      dob: parseDate(data.dob),

      nid: String(data.nid || ''),

      issueDate: parseDate(data.issueDate),

      expiryDate: parseDate(data.expiryDate),

      phone: String(data.phone || ''),

      whatsapp: String(data.whatsapp || ''),

      fatherName: String(data.fatherName || ''),

      fatherNid: String(data.fatherNid || ''),

      motherName: String(data.motherName || ''),

      motherNid: String(data.motherNid || ''),

      country: String(data.country || ''),

      maritalStatus: (data.maritalStatus as MaritalStatus) || '',

      spouseName: String(data.spouseName || ''),

      spouseNid: String(data.spouseNid || ''),

      email: String(data.email || ''),

      remarks: String(data.remarks || ''),
    })
  }, [state, passport])

  /* =========================================
     Submit
  ========================================= */

  const handleSubmit = () => {
    const valid = formRef.current?.check()

    if (
      !valid ||
      !passportId ||
      !formValue.dob ||
      !formValue.issueDate ||
      !formValue.expiryDate ||
      !formValue.maritalStatus
    ) {
      return
    }

    const payload: UpdatePassportPayload = {
      agentId: Number(formValue.agentId),

      fullName: formValue.fullName.trim(),

      passportNo: formValue.passportNo.trim(),

      dob: formValue.dob.toISOString(),

      nid: formValue.nid.trim(),

      issueDate: formValue.issueDate.toISOString(),

      expiryDate: formValue.expiryDate.toISOString(),

      phone: formValue.phone.trim(),

      whatsapp: formValue.whatsapp.trim(),

      fatherName: formValue.fatherName.trim(),

      fatherNid: formValue.fatherNid.trim() || undefined,

      motherName: formValue.motherName.trim(),

      motherNid: formValue.motherNid.trim() || undefined,

      country: formValue.country.trim(),

      maritalStatus: formValue.maritalStatus,

      spouseName: formValue.maritalStatus === 'MARRIED' ? formValue.spouseName.trim() : undefined,

      spouseNid: formValue.maritalStatus === 'MARRIED' ? formValue.spouseNid.trim() : undefined,

      email: formValue.email.trim() || undefined,

      remarks: formValue.remarks.trim() || undefined,
    }

    updatePassport(
      {
        id: passportId,
        payload,
      },
      {
        onSuccess: () => {
          navigate('/list-passport')
        },
      },
    )
  }

  /* =========================================
     Loading
  ========================================= */

  if (isFetching || isAgentsLoading) {
    return <div className="p-5 text-center">Loading...</div>
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      <Heading level={4} className="text-center">
        Edit Passport
      </Heading>

      <Divider />

      <Form
        ref={formRef}
        model={FormModel}
        formValue={formValue}
        onChange={(value) => {
          const nextValue = value as FormValue

          if (nextValue.maritalStatus !== 'MARRIED') {
            nextValue.spouseName = ''
            nextValue.spouseNid = ''
          }

          setFormValue(nextValue)
        }}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
          {/* Passport Name */}

          <Form.Stack fluid>
            <Form.Group controlId="fullName">
              <Form.Label>Passport Name</Form.Label>

              <Form.Control name="fullName" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* Passport Number */}

          <Form.Stack fluid>
            <Form.Group controlId="passportNo">
              <Form.Label>Passport Number</Form.Label>

              <Form.Control name="passportNo" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* DOB */}

          <Form.Stack fluid>
            <Form.Group controlId="dob">
              <Form.Label>Date of Birth</Form.Label>

              <Form.Control
                name="dob"
                accepter={DateInput}
                format="dd/MMM/yyyy"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* NID */}

          <Form.Stack fluid>
            <Form.Group controlId="nid">
              <Form.Label>NID</Form.Label>

              <Form.Control name="nid" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* Issue Date */}

          <Form.Stack fluid>
            <Form.Group controlId="issueDate">
              <Form.Label>Issue Date</Form.Label>

              <Form.Control
                name="issueDate"
                accepter={DateInput}
                format="dd/MMM/yyyy"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Expiry Date */}

          <Form.Stack fluid>
            <Form.Group controlId="expiryDate">
              <Form.Label>Expire Date</Form.Label>

              <Form.Control
                name="expiryDate"
                accepter={DateInput}
                format="dd/MMM/yyyy"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Phone */}

          <Form.Stack fluid>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>

              <Form.Control name="phone" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* WhatsApp */}

          <Form.Stack fluid>
            <Form.Group controlId="whatsapp">
              <Form.Label>WhatsApp</Form.Label>

              <Form.Control name="whatsapp" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* Father Name */}

          <Form.Stack fluid>
            <Form.Group controlId="fatherName">
              <Form.Label>Father Name</Form.Label>

              <Form.Control name="fatherName" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* Father NID */}

          <Form.Stack fluid>
            <Form.Group controlId="fatherNid">
              <Form.Label>Father NID</Form.Label>

              <Form.Control
                name="fatherNid"
                type="tel"
                placeholder="(optional)"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Mother Name */}

          <Form.Stack fluid>
            <Form.Group controlId="motherName">
              <Form.Label>Mother Name</Form.Label>

              <Form.Control name="motherName" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* Mother NID */}

          <Form.Stack fluid>
            <Form.Group controlId="motherNid">
              <Form.Label>Mother NID</Form.Label>

              <Form.Control
                name="motherNid"
                type="tel"
                placeholder="(optional)"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Country */}

          <Form.Stack fluid>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>

              <Form.Control
                block
                name="country"
                accepter={SelectPicker}
                data={countryData}
                placeholder="Select"
                placement="top"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Marital Status */}

          <Form.Stack fluid>
            <Form.Group controlId="maritalStatus">
              <Form.Label>Marital Status</Form.Label>

              <Form.Control
                block
                name="maritalStatus"
                accepter={SelectPicker}
                data={maritalStatusData}
                searchable={false}
                cleanable={false}
                placeholder="Select"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Spouse */}

          {formValue.maritalStatus === 'MARRIED' && (
            <>
              <Form.Stack fluid>
                <Form.Group controlId="spouseName">
                  <Form.Label>Spouse Name</Form.Label>

                  <Form.Control name="spouseName" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>

              <Form.Stack fluid>
                <Form.Group controlId="spouseNid">
                  <Form.Label>Spouse NID</Form.Label>

                  <Form.Control name="spouseNid" type="tel" errorPlacement="bottomEnd" />
                </Form.Group>
              </Form.Stack>
            </>
          )}

          {/* Email */}

          <Form.Stack fluid>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>

              <Form.Control
                name="email"
                type="email"
                placeholder="(optional)"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Agent */}

          <Form.Stack fluid>
            <Form.Group controlId="agentId">
              <Form.Label>From Agent</Form.Label>

              <Form.Control
                block
                name="agentId"
                accepter={SelectPicker}
                data={agentData}
                placeholder="Select agent"
                searchable
                cleanable={false}
                placement="top"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Remarks */}

          <Form.Stack fluid className="md:col-span-2">
            <Form.Group controlId="remarks">
              <Form.Label>Remarks</Form.Label>

              <Form.Control
                name="remarks"
                accepter={Textarea}
                rows={1}
                placeholder="(optional)"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>
        </div>

        {/* Actions */}

        <div className="mt-5 flex justify-end gap-2">
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="subtle"
            type="button"
            disabled={isUpdating}
            onClick={() => navigate('/list-passport')}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            type="submit"
            loading={isUpdating}
            disabled={isUpdating}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Page
