/**
 * Add agent page.
 * Captures agent contact details and preserves draft data.
 */

import { Icon } from '@rsuite/icons'
import { useEffect, useRef, useState } from 'react'
import { IoMdAdd } from 'react-icons/io'
import { Button, Divider, Form, Heading, Textarea } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'
import type { FormInstance } from 'rsuite'

import { useNavigate } from 'react-router'

import { useCreateAgent } from '@/hooks/useAgent'

/* =========================================
   Draft Storage Key
========================================= */

const AGENT_DRAFT_KEY = 'add-agent-form-draft'

/* =========================================
   Form Validation Model
========================================= */

const FormModel = SchemaModel({
  name: StringType().isRequired('Agent name is required.'),

  phone: StringType().isRequired('Phone is required.'),

  whatsapp: StringType().isRequired('WhatsApp is required.'),

  email: StringType().isEmail('Please enter a valid email address.'),

  address: StringType(),

  remarks: StringType(),
})

/* =========================================
   Initial Form Value
========================================= */

const initialValue = {
  name: '',
  phone: '',
  whatsapp: '',
  email: '',
  address: '',
  remarks: '',
}

type FormValue = typeof initialValue

/* =========================================
   Load Saved Draft
========================================= */

const getSavedDraft = (): FormValue => {
  try {
    const savedDraft = sessionStorage.getItem(AGENT_DRAFT_KEY)

    if (!savedDraft) {
      return initialValue
    }

    const parsedDraft = JSON.parse(savedDraft)

    return {
      ...initialValue,
      ...parsedDraft,
    }
  } catch {
    return initialValue
  }
}

/* =========================================
   Add Agent Page
========================================= */

const Page = () => {
  const navigate = useNavigate()

  const formRef = useRef<FormInstance>(null)

  /* =========================================
     Form State
  ========================================= */

  const [formValue, setFormValue] = useState<FormValue>(() => getSavedDraft())

  /* =========================================
     Create Agent Hook
  ========================================= */

  const { mutate: createAgent, isPending } = useCreateAgent()

  /* =========================================
     Save Draft
  ========================================= */

  useEffect(() => {
    try {
      sessionStorage.setItem(AGENT_DRAFT_KEY, JSON.stringify(formValue))
    } catch {
      // Ignore storage errors
    }
  }, [formValue])

  /* =========================================
     Clear Draft
  ========================================= */

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(AGENT_DRAFT_KEY)
    } catch {
      // Ignore storage errors
    }
  }

  /* =========================================
     Submit
  ========================================= */

  const handleFormSubmit = () => {
    const valid = formRef.current?.check()

    if (!valid) return

    createAgent(
      {
        name: formValue.name.trim(),

        phone: formValue.phone.trim(),

        whatsapp: formValue.whatsapp.trim(),

        email: formValue.email.trim() || undefined,

        address: formValue.address.trim() || undefined,

        remarks: formValue.remarks.trim() || undefined,
      },
      {
        onSuccess: () => {
          /* =============================
             Clear Saved Draft
          ============================= */

          clearDraft()

          /* =============================
             Reset Form
          ============================= */

          setFormValue(initialValue)

          formRef.current?.cleanErrors()

          /* =============================
             Redirect
          ============================= */

          navigate('/list-agent')
        },
      },
    )
  }

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      {/* =================================
          Heading
      ================================= */}

      <Heading level={4} className="text-center">
        Agent Info
      </Heading>

      <Divider />

      {/* =================================
          Form
      ================================= */}

      <Form
        ref={formRef}
        model={FormModel}
        formValue={formValue}
        onChange={(value) => setFormValue(value as FormValue)}
        onSubmit={handleFormSubmit}
      >
        <div className="grid grid-cols-1 gap-x-3 gap-y-4 md:grid-cols-2">
          {/* =================================
              Agent Name
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="name">
              <Form.Label>Agent Name</Form.Label>

              <Form.Control name="name" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Phone
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="phone">
              <Form.Label>Agent Phone</Form.Label>

              <Form.Control name="phone" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              WhatsApp
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="whatsapp">
              <Form.Label>Agent WhatsApp</Form.Label>

              <Form.Control name="whatsapp" type="tel" errorPlacement="bottomEnd" />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Email
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="email">
              <Form.Label>Agent Email</Form.Label>

              <Form.Control
                name="email"
                type="email"
                placeholder="(optional)"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Address
          ================================= */}

          <Form.Stack fluid>
            <Form.Group controlId="address">
              <Form.Label>Agent Address</Form.Label>

              <Form.Control
                name="address"
                accepter={Textarea}
                rows={1}
                placeholder="(optional)"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* =================================
              Remarks
          ================================= */}

          <Form.Stack fluid>
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
            disabled={isPending}
          >
            Add Agent
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Page
