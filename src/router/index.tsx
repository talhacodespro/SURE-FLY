import DashboardLayout from '@/layouts/DashboardLayout'
import {
  Analytic,
  Error,
  AddCompany,
  ListCompany,
  EditCompany,
  AddSales,
  ListSales,
  EditSales,
  AddPassport,
  ListPassport,
  EditPassport,
  ReceiveVoucher,
  CompanyPayment,
  PaymentMethod,
  Profile,
  Login,
  FundTransfer,
  AddExpense,
  ListExpense,
  ExpenseCategory,
} from '@/pages'
import { createBrowserRouter } from 'react-router'
import RequireAuth from '@/guards/RequireAuth'

// router defined here and mange the app ⤵
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
        element: <Analytic />,
      },

      {
        path: '/add-company',
        element: <AddCompany />,
      },
      {
        path: '/list-company',
        element: <ListCompany />,
      },
      {
        path: '/edit-company/:id',
        element: <EditCompany />,
      },
      {
        path: '/add-sales',
        element: <AddSales />,
      },
      {
        path: '/list-sales',
        element: <ListSales />,
      },
      {
        path: '/edit-sales/:id',
        element: <EditSales />,
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
        path: '/edit-passport/:id',
        element: <EditPassport />,
      },
      {
        path: '/receive-voucher',
        element: <ReceiveVoucher />,
      },
      {
        path: '/company-payment',
        element: <CompanyPayment />,
      },
      {
        path: '/payment-method',
        element: <PaymentMethod />,
      },
      {
        path: '/fund-transfer',
        element: <FundTransfer />,
      },
      {
        path: '/add-expense',
        element: <AddExpense />,
      },
      {
        path: '/list-expense',
        element: <ListExpense />,
      },
      {
        path: '/expense-category',
        element: <ExpenseCategory />,
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
