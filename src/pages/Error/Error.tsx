/**
 * Fallback error page.
 * Shown for unknown routes and lets users go home or back.
 */
import { Button, Center, Heading, Text } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { useNavigate } from 'react-router'
import { MdOutlineTravelExplore } from 'react-icons/md'
import { IoHome } from 'react-icons/io5'
import { BiArrowBack } from 'react-icons/bi'

const Page = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--rs-body)] px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--rs-border-primary)] bg-[var(--rs-bg-card)] p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--rs-primary-50)]">
          <Icon as={MdOutlineTravelExplore} className="text-[52px] text-[var(--rs-primary-500)]" />
        </div>

        <div className="mb-2 text-7xl font-bold tracking-tight text-[var(--rs-primary-500)] md:text-8xl">
          404
        </div>

        <Heading level={3} className="mb-3">
          Page Not Found
        </Heading>

        <Center>
          <Text className="max-w-md py-8 text-[var(--rs-text-secondary)]">
            Sorry, the page you are looking for does not exist or may have been moved.
          </Text>
        </Center>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            appearance="primary"
            startIcon={<Icon as={IoHome} />}
            onClick={() => navigate('/')}
          >
            Go Dashboard
          </Button>

          <Button
            appearance="default"
            startIcon={<Icon as={BiArrowBack} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>

        <div className="mt-8 border-t border-[var(--rs-border-primary)] pt-5">
          <p className="text-sm text-[var(--rs-text-secondary)]">Travel Agency Management System</p>
          <p className="mt-1.5 text-sm text-[var(--rs-text-secondary)]">
            &copy; {new Date().getFullYear()} talhacodes All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
