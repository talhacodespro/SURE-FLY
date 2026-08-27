/**
 * App sidebar navigation.
 * Builds grouped nav items and handles mobile open/close state.
 */
import { Nav, Sidenav } from 'rsuite'
import { Icon } from '@rsuite/icons'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/cn'
import { useSidebar } from '@/store/useSidebar'
import { BiSolidDashboard } from 'react-icons/bi'
import { FaPassport } from 'react-icons/fa6'
import { BsPersonLinesFill } from 'react-icons/bs'
import type { IconType } from 'react-icons/lib'

type SidebarChild = {
  label: string
  path: string
}

type SidebarItem =
  | {
      type: 'item'
      label: string
      icon: IconType
      path: string
    }
  | {
      type: 'menu'
      label: string
      icon: IconType
      children: SidebarChild[]
    }
  | {
      type: 'divider'
    }

// Sidebar items
const sidebarItems: SidebarItem[] = [
  {
    type: 'item',
    label: 'Dashboard',
    icon: BiSolidDashboard,
    path: '/',
  },

  {
    type: 'menu',
    label: 'Agent',
    icon: BsPersonLinesFill,
    children: [
      {
        label: 'Add Agent',
        path: '/add-agent',
      },
      {
        label: 'List Agent',
        path: '/list-agent',
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
        path: '/add-passport',
      },
      {
        label: 'List Passport',
        path: '/list-passport',
      },
      {
        label: 'List Agent Passport',
        path: '/list-agent-passport',
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
