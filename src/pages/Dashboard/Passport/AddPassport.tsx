/**
 * Add passport page.
 * Collects passport details, creates a new passport
 * and preserves unfinished form data.
 */

import { Icon } from '@rsuite/icons'
import { countries } from 'country-data-list'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Button, DateInput, Divider, Form, Heading, SelectPicker, Textarea } from 'rsuite'
import { DateType, SchemaModel, StringType } from 'rsuite/Schema'
import type { FormInstance } from 'rsuite'

import { useAgents } from '@/hooks/useAgent'
import { useCreatePassport } from '@/hooks/usePassport'

/* =========================================
   Draft Storage Key
========================================= */

const PASSPORT_DRAFT_KEY = 'add-passport-form-draft'

/* =========================================
   Validation Model
========================================= */

const PassportModel = SchemaModel({
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
   Initial Value
========================================= */

const initialValue = {
  agentId: '',

  fullName: '',
  passportNo: '',

  dob: null as Date | null,

  nid: '',

  issueDate: null as Date | null,
  expiryDate: null as Date | null,

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

type FormValue = typeof initialValue

/* =========================================
   Parse Draft Date
========================================= */

const parseDraftDate = (value: unknown): Date | null => {
  if (!value) return null

  if (value instanceof Date) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

/* =========================================
   Load Saved Draft
========================================= */

const getSavedDraft = (): FormValue => {
  try {
    const saved = sessionStorage.getItem(PASSPORT_DRAFT_KEY)

    if (!saved) {
      return initialValue
    }

    const parsed = JSON.parse(saved) as Partial<FormValue>

    return {
      ...initialValue,
      ...parsed,

      dob: parseDraftDate(parsed.dob),

      issueDate: parseDraftDate(parsed.issueDate),

      expiryDate: parseDraftDate(parsed.expiryDate),
    }
  } catch {
    sessionStorage.removeItem(PASSPORT_DRAFT_KEY)

    return initialValue
  }
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
   Page
========================================= */

const Page = () => {
  const formRef = useRef<FormInstance>(null)

  const skipNextDraftSave = useRef(false)

  /* =========================================
     Form State
  ========================================= */

  const [formValue, setFormValue] = useState<FormValue>(() => getSavedDraft())

  /* =========================================
     Hooks
  ========================================= */

  const { data: agentsRes, isLoading: isAgentsLoading } = useAgents()

  const { mutate: createPassport, isPending } = useCreatePassport()

  /* =========================================
     Save Draft Automatically
  ========================================= */

  useEffect(() => {
    if (skipNextDraftSave.current) {
      skipNextDraftSave.current = false

      return
    }

    try {
      sessionStorage.setItem(PASSPORT_DRAFT_KEY, JSON.stringify(formValue))
    } catch {
      // Ignore storage errors
    }
  }, [formValue])

  /* =========================================
     Clear Draft
  ========================================= */

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(PASSPORT_DRAFT_KEY)
    } catch {
      // Ignore storage errors
    }
  }

  /* =========================================
     Agent Picker Data
  ========================================= */

  const agentData = useMemo(() => {
    const agents = agentsRes?.data ?? []

    return agents.map((agent) => ({
      label: agent.name,
      value: String(agent.id),
    }))
  }, [agentsRes])

  /* =========================================
     Country Data
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
     Form Change
  ========================================= */

  const handleFormChange = (value: Record<string, unknown>) => {
    const nextValue = value as FormValue

    if (nextValue.maritalStatus !== 'MARRIED') {
      nextValue.spouseName = ''
      nextValue.spouseNid = ''
    }

    setFormValue(nextValue)
  }

  /* =========================================
     Submit
  ========================================= */

  const handleFormSubmit = () => {
    const valid = formRef.current?.check()

    if (!valid) return

    if (!formValue.dob || !formValue.issueDate || !formValue.expiryDate) {
      return
    }

    const payload = {
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

      maritalStatus: formValue.maritalStatus as 'MARRIED' | 'UNMARRIED',

      spouseName: formValue.maritalStatus === 'MARRIED' ? formValue.spouseName.trim() : undefined,

      spouseNid: formValue.maritalStatus === 'MARRIED' ? formValue.spouseNid.trim() : undefined,

      email: formValue.email.trim() || undefined,

      remarks: formValue.remarks.trim() || undefined,
    }

    createPassport(payload, {
      onSuccess: () => {
        /* =============================
           Clear Draft
        ============================= */

        clearDraft()

        /*
         * Prevent the reset value from
         * immediately being saved again.
         */
        skipNextDraftSave.current = true

        /* =============================
           Reset Form
        ============================= */

        setFormValue(initialValue)

        formRef.current?.cleanErrors()
      },
    })
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      {/* =================================
          Heading
      ================================= */}

      <Heading level={4} className="text-center">
        Passport Info
      </Heading>

      <Divider />

      {/* =================================
          Form
      ================================= */}

      <Form
        ref={formRef}
        model={PassportModel}
        formValue={formValue}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
          {/* =================================
              Passport Name
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="fullName">
              <Form.Label>Passport Name</Form.Label>

              <Form.Control name="fullName" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Passport Number
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="passportNo">
              <Form.Label>Passport Number</Form.Label>

              <Form.Control name="passportNo" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Date of Birth
          ================================= */}

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

          {/* =================================
              NID
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="nid">
              <Form.Label>NID</Form.Label>

              <Form.Control name="nid" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Issue Date
          ================================= */}

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

          {/* =================================
              Expiry Date
          ================================= */}

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

          {/* =================================
              Phone
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>

              <Form.Control name="phone" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              WhatsApp
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="whatsapp">
              <Form.Label>WhatsApp</Form.Label>

              <Form.Control name="whatsapp" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Father Name
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="fatherName">
              <Form.Label>Father Name</Form.Label>

              <Form.Control name="fatherName" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Father NID
          ================================= */}

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

          {/* =================================
              Mother Name
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="motherName">
              <Form.Label>Mother Name</Form.Label>

              <Form.Control name="motherName" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Mother NID
          ================================= */}

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

          {/* =================================
              Country
          ================================= */}

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

          {/* =================================
              Marital Status
          ================================= */}

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

          {/* =================================
              Spouse Fields
          ================================= */}

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

          {/* =================================
              Email
          ================================= */}

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

          {/* =================================
              From Agent
          ================================= */}

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
                loading={isAgentsLoading}
                errorPlacement="bottomEnd"
                placement="top"
              />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Remarks
          ================================= */}

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

        {/* =================================
            Submit
        ================================= */}

        <Form.Group className="mt-5 flex justify-end">
          <Button
            startIcon={<Icon as={IoMdAdd} />}
            appearance="primary"
            type="submit"
            loading={isPending}
            disabled={isPending || isAgentsLoading}
          >
            Add Passport
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Page
