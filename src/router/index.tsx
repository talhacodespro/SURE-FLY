/**
 * App route definitions.
 * Uses react-router's data router (createBrowserRouter).
 */
import DashboardLayout from '@/layouts/DashboardLayout'
import {
  Error,
  AddAgent,
  ListAgent,
  EditAgent,
  AddPassport,
  ListPassport,
  EditPassport,
  Profile,
  Login,
  ListAgentPassport,
  Dashboard,
} from '@/pages'
import { createBrowserRouter } from 'react-router'
import RequireAuth from '@/guards/RequireAuth'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/add-agent',
        element: <AddAgent />,
      },
      {
        path: '/list-agent',
        element: <ListAgent />,
      },
      {
        path: '/edit-agent/:id',
        element: <EditAgent />,
      },

      {
        path: '/add-passport',
        element: <AddPassport />,
      },
      {
        path: '/list-passport',
        element: <ListPassport />,
      },
      {
        path: '/list-agent-passport',
        element: <ListAgentPassport />,
      },
      {
        path: '/edit-passport/:id',
        element: <EditPassport />,
      },
    ],
  },
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export default router
