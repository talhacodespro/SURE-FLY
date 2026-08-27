/**
 * Login page.
 * Validates credentials, logs the user in,
 * and redirects to dashboard.
 */

import { useEffect, useRef, useState } from 'react'

import {
  Button,
  Checkbox,
  Form,
  Heading,
  Message,
  PasswordInput,
  Schema,
  StringType,
  Text,
  toaster,
} from 'rsuite'

import type { FormInstance } from 'rsuite'

import { useNavigate } from 'react-router'

import { Icon } from '@rsuite/icons'

import { MdFlightTakeoff } from 'react-icons/md'

import { IoMdLogIn } from 'react-icons/io'

import { useAuth } from '@/store/useAuth'

import { useLogin } from '@/hooks/useAuth'

/* =========================================
   Validation Model
========================================= */

const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),

  password: StringType()
    .isRequired('Password is required.')
    .addRule(
      (value) => value.length >= 6,

      'Password must be at least 6 characters.',
    ),
})

/* =========================================
   Types
========================================= */

type FormValue = {
  email: string
  password: string
}

/* =========================================
   Initial Value
========================================= */

const initialValue: FormValue = {
  email: '',
  password: '',
}

/* =========================================
   Page
========================================= */

const Page = () => {
  const navigate = useNavigate()

  const formRef = useRef<FormInstance>(null)

  /* =========================================
     Auth
  ========================================= */

  const isAuth = useAuth((state) => state.isAuth)

  const loginMutation = useLogin()

  /* =========================================
     States
  ========================================= */

  const [formValue, setFormValue] = useState<FormValue>(initialValue)

  const [rememberMe, setRememberMe] = useState(false)

  /* =========================================
     Already Logged In
  ========================================= */

  useEffect(() => {
    if (isAuth) {
      navigate('/', {
        replace: true,
      })
    }
  }, [isAuth, navigate])

  /* =========================================
     Submit
  ========================================= */

  const handleSubmit = () => {
    const valid = formRef.current?.check()

    if (!valid) {
      return
    }

    loginMutation.mutate(
      {
        email: formValue.email.trim(),

        password: formValue.password,
      },

      {
        onSuccess: () => {
          toaster.push(
            <Message type="success" showIcon>
              Logged in successfully
            </Message>,

            {
              placement: 'bottomEnd',
            },
          )

          navigate('/', {
            replace: true,
          })
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--rs-body)] px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--rs-border-primary)] bg-[var(--rs-bg-card)] p-6 shadow-sm">
        {/* =====================================
            Header
        ===================================== */}

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rs-primary-50)] text-[var(--rs-primary-500)]">
            <Icon as={MdFlightTakeoff} className="text-4xl" />
          </div>

          <Heading level={3}>SURE FLY LTD</Heading>

          <Text className="pt-1 text-[var(--rs-text-secondary)]">Login to your dashboard</Text>
        </div>

        {/* =====================================
            Login Form
        ===================================== */}

        <Form
          ref={formRef}
          model={model}
          formValue={formValue}
          onChange={(value) => setFormValue(value as FormValue)}
          onSubmit={handleSubmit}
        >
          {/* Email */}

          <Form.Stack fluid>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>

              <Form.Control
                name="email"
                type="email"
                autoComplete="email"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Password */}

          <Form.Stack fluid className="mt-4">
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>

              <Form.Control
                name="password"
                accepter={PasswordInput}
                autoComplete="current-password"
                errorPlacement="bottomEnd"
              />
            </Form.Group>
          </Form.Stack>

          {/* Remember Me */}

          <Form.Group className="mt-4">
            <Checkbox checked={rememberMe} onChange={(_, checked) => setRememberMe(checked)}>
              Remember Me
            </Checkbox>
          </Form.Group>

          {/* Submit */}

          <Form.Group className="mt-5">
            <Button
              block
              appearance="primary"
              type="submit"
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              startIcon={<Icon as={IoMdLogIn} />}
            >
              Login
            </Button>
          </Form.Group>
        </Form>

        {/* =====================================
            Footer
        ===================================== */}

        <p className="mt-6 text-center text-xs text-[var(--rs-text-secondary)]">
          © {new Date().getFullYear()} SURE FLY LTD
        </p>
      </div>
    </div>
  )
}

export default Page
