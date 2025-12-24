import DashboardLayout from '@/layouts/DashboardLayout'
import {
  Analytic,
  Error,
  AddCompany,
  ListCompany,
  AddSales,
  ListSales,
  AddPassport,
  ListPassport,
  ReceiveVoucher,
  CompanyPayment,
  PaymentMethod,
} from '@/pages'
import { createBrowserRouter } from 'react-router'

// router defined here and mange the app ⤵
const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Analytic />,
      },

      {
        path: '/addCompany',
        element: <AddCompany />,
      },
      {
        path: '/listCompany',
        element: <ListCompany />,
      },
      {
        path: '/addSales',
        element: <AddSales />,
      },
      {
        path: '/listSales',
        element: <ListSales />,
      },
      {
        path: '/addPassport',
        element: <AddPassport />,
      },
      {
        path: '/listPassport',
        element: <ListPassport />,
      },
      {
        path: '/receiveVoucher',
        element: <ReceiveVoucher />,
      },
      {
        path: '/companyPayment',
        element: <CompanyPayment />,
      },
      {
        path: '/paymentMethod',
        element: <PaymentMethod />,
      },
    ],
  },
])

export default router
