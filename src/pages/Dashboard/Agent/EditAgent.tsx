/**
 * Edit agent page.
 * Loads an existing agent and updates agent information.
 */

import { Icon } from '@rsuite/icons'
import { useEffect, useRef, useState } from 'react'
import { IoMdClose, IoMdSave } from 'react-icons/io'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Button, Divider, Form, Heading, Textarea } from 'rsuite'
import type { FormInstance } from 'rsuite'
import { SchemaModel, StringType } from 'rsuite/Schema'

import { useAgent, useUpdateAgent } from '@/hooks/useAgent'

import type { Agent } from '@/lib/api/agent'

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
   Edit Agent Page
========================================= */

const Page = () => {
  const navigate = useNavigate()

  const { id } = useParams()

  const { state } = useLocation() as {
    state?: Agent
  }

  const agentId = Number(id)

  /* =========================================
     Hooks
  ========================================= */

  const { data: agent, isLoading: isFetching } = useAgent(agentId, Boolean(agentId) && !state)

  const { mutate: updateAgent, isPending: isUpdating } = useUpdateAgent()

  /* =========================================
     State
  ========================================= */

  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  const formRef = useRef<FormInstance>(null)

  /* =========================================
     Load Agent Data
  ========================================= */

  useEffect(() => {
    const data = state || agent

    if (!data) return

    setFormValue({
      name: data.name || '',

      phone: data.phone || '',

      whatsapp: data.whatsapp || '',

      email: data.email || '',

      address: data.address || '',

      remarks: data.remarks || '',
    })
  }, [state, agent])

  /* =========================================
     Submit
  ========================================= */

  const handleSubmit = () => {
    const valid = formRef.current?.check()

    if (!valid || !agentId) return

    updateAgent(
      {
        id: agentId,

        payload: {
          name: formValue.name.trim(),

          phone: formValue.phone.trim(),

          whatsapp: formValue.whatsapp.trim(),

          email: formValue.email.trim() || undefined,

          address: formValue.address.trim() || undefined,

          remarks: formValue.remarks.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          navigate('/list-agent')
        },
      },
    )
  }

  /* =========================================
     Loading
  ========================================= */

  const loading = isFetching || isUpdating

  return (
    <div className="bg-background container mx-auto max-w-4xl rounded-md p-5">
      {/* =====================================
          Heading
      ===================================== */}

      <Heading level={4} className="text-center">
        Edit Agent
      </Heading>

      <Divider />

      {/* =====================================
          Form
      ===================================== */}

      <Form
        ref={formRef}
        model={FormModel}
        formValue={formValue}
        onChange={(value) => setFormValue(value as FormValue)}
        onSubmit={handleSubmit}
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
            Actions
        ================================= */}

        <div className="mt-5 flex justify-end gap-2">
          <Button
            startIcon={<Icon as={IoMdClose} />}
            appearance="subtle"
            type="button"
            disabled={isUpdating}
            onClick={() => navigate('/list-agent')}
          >
            Cancel
          </Button>

          <Button
            startIcon={<Icon as={IoMdSave} />}
            appearance="primary"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default Page
