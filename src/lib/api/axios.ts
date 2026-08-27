/**
 * Shared Axios API client.
 * Adds auth token headers and shows toast messages for API errors.
 */
import { useAuth } from '@/store/useAuth'
import message from '@/utils/message'
import axios, { AxiosHeaders } from 'axios'
import { toaster } from 'rsuite'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (token) {
    config.headers = new AxiosHeaders(config.headers)
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const messageData = error?.response?.data?.message || error?.message || 'Something went wrong'

    toaster.push(message({ message: messageData, type: 'error' }), { placement: 'bottomEnd' })

    if (error?.response?.status === 401) {
      useAuth.getState().logout()
      // localStorage.removeItem('token')
      // window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default api
