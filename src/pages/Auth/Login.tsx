import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Heading,
  Message,
  PasswordInput,
  Schema,
  StringType,
  toaster,
} from 'rsuite'
import type { FormInstance } from 'rsuite'
import { useNavigate } from 'react-router'
import { useLogin } from '@/hooks/useUser'
import { useAuth } from '@/store/useAuth'

// ========== Form Validation Model ==========
// Login form er validation rule define kora hocche
const model = Schema.Model({
  email: StringType().isEmail('Please enter a valid email.').isRequired('Email is required.'),
  password: StringType()
    .isRequired('Password is required.')
    .addRule((value) => value.length >= 6, 'Password must be at least 6 characters.'),
})

// ========== Form Value Type ==========
type FormValue = {
  email: string
  password: string
}

// ========== Login Page Component ==========
const Page = () => {
  const navigate = useNavigate()
  const isAuth = useAuth((state) => state.isAuth) // Auth state check kora hocche
  const loginMutation = useLogin() // Login API hook
  const formRef = useRef<FormInstance>(null) // Form er reference
  const [formValue, setFormValue] = useState<FormValue>({ email: '', password: '' }) // Form er current value
  const [rememberMe, setRememberMe] = useState(false) // Remember me checkbox er state

  // ========== Redirect Authenticated User ==========
  // Jodi user already login thake tahole home page e redirect kora hobe
  useEffect(() => {
    if (isAuth) {
      navigate('/', { replace: true })
    }
  }, [isAuth, navigate])

  // ========== Handle Login Form Submit ==========
  const handleSubmit = () => {
    const valid = formRef.current?.check()
    if (!valid) return

    loginMutation.mutate(
      {
        ...formValue,
        rememberMe,
      },
      {
        onSuccess: () => {
          toaster.push(
            <Message type="success" showIcon>
              Logged in successfully
            </Message>,
            { placement: 'bottomEnd' },
          )

          navigate('/')
        },
      },
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md items-center justify-center">
        <div className="bg-background w-full rounded-md p-6">
          <Heading level={3} className="text-center">
            SURE FLY LTD
          </Heading>

          <Divider />
          {/* ========== Login Form ========== */}
          <Form
            ref={formRef}
            model={model}
            formValue={formValue}
            onChange={(value) => setFormValue(value as FormValue)}
            onSubmit={handleSubmit}
          >
            {/* ========== Email Input Section ========== */}
            <Form.Stack fluid>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" errorPlacement="bottomEnd" />
              </Form.Group>
            </Form.Stack>
            {/* ========== Password Input Section ========== */}
            <Form.Stack fluid className="mt-4">
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  accepter={PasswordInput}
                  errorPlacement="bottomEnd"
                />
              </Form.Group>
            </Form.Stack>

            {/* ========== Remember Me Section ========== */}
            <Form.Group className="mt-4">
              <Checkbox checked={rememberMe} onChange={(_, checked) => setRememberMe(checked)}>
                Remember Me
              </Checkbox>
            </Form.Group>

            {/* ========== Login Button ========== */}
            <Form.Group className="mt-4">
              <Button
                block
                appearance="primary"
                type="submit"
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
              >
                Login
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Page
