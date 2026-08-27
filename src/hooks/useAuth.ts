import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getMe, impersonateAgent, login, type LoginPayload } from '@/lib/api/auth'
import { ACCESS_TOKEN_KEY, saveOriginalAdminToken } from '@/lib/api/impersonation'
import { useAuth } from '@/store/useAuth'

/* =========================================
   Keys
========================================= */

export const authKeys = {
  all: ['auth'] as const,

  me: ['auth', 'me'] as const,
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'login'],

    mutationFn: (payload: LoginPayload) => login(payload),

    onSuccess: (res) => {
      const token = res.data.token

      /* =====================================
         Save Auth State
      ===================================== */

      useAuth.getState().login(token)

      /* =====================================
         Clear Old Cache
      ===================================== */

      queryClient.clear()
    },
  })
}

/* =========================================
   Me
========================================= */

export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me,

    queryFn: getMe,

    staleTime: 1000 * 60 * 5,

    retry: false,
  })
}

/* =========================================
   Impersonate Agent
========================================= */

export const useImpersonateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['auth', 'impersonate'],

    mutationFn: (userId: number) => impersonateAgent(userId),

    onSuccess: (res) => {
      /*
       * Current Admin token save।
       */
      saveOriginalAdminToken()

      /*
       * New Agent token active token হিসেবে save।
       */
      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.token)

      /*
       * Admin-এর পুরনো cached data
       * Agent account-এ দেখানো যাবে না।
       */
      queryClient.clear()

      /*
       * Agent dashboard fresh load।
       */
      window.location.href = '/'
    },
  })
}
