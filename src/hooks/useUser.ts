import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, deleteUser, getUser, getUsers, login, me, updateUser } from '@/lib/api/user'
import type {
  AuthResponse,
  CreateUserPayload,
  LoginPayload,
  UpdateUserPayload,
  User,
  MeData,
} from '@/lib/api/user'
import type { ApiResponse } from '@/types/api'
import { useAuth } from '@/store/useAuth'

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export const useUser = (id: number | string, enabled = true) => {
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: Boolean(id) && enabled,
  })
}

export const useCreateUser = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, CreateUserPayload>({
    mutationKey: ['user', 'create'],
    mutationFn: (payload) => createUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useUpdateUser = () => {
  const qc = useQueryClient()
  return useMutation<User, Error, { id: number | string; payload: UpdateUserPayload }>({
    mutationKey: ['user', 'update'],
    mutationFn: ({ id, payload }) => updateUser(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      qc.invalidateQueries({ queryKey: ['user', data.id] })
    },
  })
}

export const useDeleteUser = () => {
  const qc = useQueryClient()
  return useMutation<{ success: boolean }, Error, number | string>({
    mutationKey: ['user', 'delete'],
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export const useLogin = () => {
  const qc = useQueryClient()
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
    onSuccess: (res) => {
      useAuth.getState().login(res.data.token)
      qc.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })
}

export const useMe = () => {
  return useQuery<ApiResponse<MeData>, Error>({
    queryKey: ['auth', 'me'],
    queryFn: me,
  })
}
