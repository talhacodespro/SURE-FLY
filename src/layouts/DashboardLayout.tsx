import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <>
      <section className="flex">
        <div>
          <Sidebar />
        </div>
        <div className="ml-0 flex-1 md:ml-64">
          <Navbar />
          <div className="px-2 py-3.5 md:px-3">
            <Outlet />
          </div>
        </div>
      </section>
    </>
  )
}

export default DashboardLayout
