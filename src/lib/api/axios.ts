import axios, { AxiosHeaders } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers = new AxiosHeaders(config.headers)
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

export default api
