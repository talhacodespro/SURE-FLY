import { Button, Message } from 'rsuite'

import { useMe } from '@/hooks/useAuth'
import { exitImpersonation } from '@/lib/api/impersonation'

/* =========================================
   Impersonation Banner
========================================= */

const ImpersonationBanner = () => {
  const { data: meRes } = useMe()

  const user = meRes?.data

  if (!user?.isImpersonating) {
    return null
  }

  return (
    <div className="mb-4">
      <Message type="warning" showIcon>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            You are logged in as <strong>{user.fullName}</strong>.
            {user.impersonatedBy && (
              <>
                {' '}
                Original Admin: <strong>{user.impersonatedBy.fullName}</strong>
              </>
            )}
          </div>

          <Button appearance="primary" color="orange" size="sm" onClick={exitImpersonation}>
            Return to Admin
          </Button>
        </div>
      </Message>
    </div>
  )
}

export default ImpersonationBanner
