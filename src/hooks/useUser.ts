import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createUser, getUser, getUsers, updateProfile, updateUser } from '@/lib/api/user'

import type { CreateUserPayload, UpdateProfilePayload, UpdateUserPayload } from '@/lib/api/user'

/* =========================================
   Keys
========================================= */

export const userKeys = {
  all: ['users'] as const,

  me: ['auth', 'me'] as const,

  detail: (id: number) => ['user', id] as const,
}

/* =========================================
   Users
========================================= */

export const useUsers = (enabled = true) => {
  return useQuery({
    queryKey: userKeys.all,

    queryFn: getUsers,
    enabled,
    staleTime: 1000 * 60 * 5,
  })
}

/* =========================================
   User
========================================= */

export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),

    queryFn: () => getUser(id),

    enabled: Boolean(id),
  })
}

/* =========================================
   Create User
========================================= */

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'create'],

    mutationFn: (payload: CreateUserPayload) => createUser(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      })
    },
  })
}

/* =========================================
   Update Profile
========================================= */

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['profile', 'update'],

    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.me,
      })

      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      })
    },
  })
}

/* =========================================
   Admin Update User
========================================= */

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'update'],

    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUser(id, payload),

    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      })

      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      })
    },
  })
}
