import { Nav, Sidenav } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/cn'
import { useSidebar } from '@/store/useSidebar'
import { BiSolidDashboard } from 'react-icons/bi'
import { FaBuildingColumns, FaPassport } from 'react-icons/fa6'
import { IoPricetagsSharp } from 'react-icons/io5'
import { MdAccountBalanceWallet } from 'react-icons/md'

// Sidebar items
const sidebarItems = [
  {
    type: 'item',
    label: 'Dashboard',
    icon: BiSolidDashboard,
    path: '/',
  },
  {
    type: 'menu',
    label: 'Company',
    icon: FaBuildingColumns,
    children: [
      {
        label: 'Add Company',
        path: '/addCompany',
      },
      {
        label: 'List Company',
        path: '/listCompany',
      },
    ],
  },
  {
    type: 'menu',
    label: 'Sales',
    icon: IoPricetagsSharp,
    children: [
      {
        label: 'Add Sales',
        path: '/addSales',
      },
      {
        label: 'List Sales',
        path: '/listSales',
      },
    ],
  },
  {
    type: 'menu',
    label: 'Passport',
    icon: FaPassport,
    children: [
      {
        label: 'Add Passport',
        path: '/addPassport',
      },
      {
        label: 'List Passport',
        path: '/listPassport',
      },
    ],
  },
  {
    type: 'menu',
    label: 'Account',
    icon: MdAccountBalanceWallet,
    children: [
      {
        label: 'Receive Voucher',
        path: '/receiveVoucher',
      },
      {
        label: 'Company Payment',
        path: '/companyPayment',
      },
      {
        label: 'Payment Method',
        path: '/paymentMethod',
      },
    ],
  },
]

const Sidebar = () => {
  const { sidebar, setSidebar } = useSidebar() // Sidebar toggle state for mobile
  const { pathname } = useLocation() // Get the current pathname

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform shadow-lg',
          sidebar ? 'translate-x-0' : '-translate-x-full',
          'transition-transform duration-300 ease-in-out md:translate-x-0',
        )}
      >
        <Sidenav
          defaultOpenKeys={['Company', 'Sales', 'Account', 'Passport']}
          className="h-screen overflow-auto"
          appearance="default"
        >
          <Sidenav.Body>
            <Nav activeKey={pathname}>
              {sidebarItems.map((item, index) => {
                if (item.type === 'item') {
                  return (
                    <Nav.Item
                      key={index}
                      eventKey={item.path}
                      icon={<Icon as={item.icon} />}
                      as={Link}
                      to={item.path as string}
                      onClick={() => setSidebar(false)}
                    >
                      {item.label}
                    </Nav.Item>
                  )
                }

                if (item.type === 'menu') {
                  return (
                    <Nav.Menu
                      key={index}
                      title={item.label}
                      eventKey={item.label}
                      icon={<Icon as={item.icon} />}
                    >
                      {item.children?.map((child, childIndex) => (
                        <Nav.Item
                          key={childIndex}
                          eventKey={child.path}
                          as={Link}
                          to={child.path}
                          onClick={() => setSidebar(false)}
                        >
                          {child.label}
                        </Nav.Item>
                      ))}
                    </Nav.Menu>
                  )
                }
                return null
              })}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </div>
      {/* Overlay (appears when the sidebar is open on mobile) */}
      {sidebar && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={() => setSidebar(false)} // Clicking the overlay closes the sidebar
        />
      )}
    </>
  )
}

export default Sidebar
