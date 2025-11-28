import { useSidebar } from '@/store/useSidebar'
import { Menu } from '@rsuite/icons'
import { IconButton } from 'rsuite'

const Navbar = () => {
  // const { theme, setTheme } = useTheme() // Theme state
  const { sidebar, setSidebar } = useSidebar() // Sidebar toggle state
  return (
    <div className="flex h-[50px] items-center justify-between bg-[#F7F7FA] px-1.5 shadow-xs dark:bg-[#1B1D24]">
      {/* Mobile Menu Button */}
      <div className="hidden md:block"></div>
      <div className="block md:hidden">
        <IconButton
          icon={<Menu />}
          appearance="subtle"
          size="lg"
          onClick={() => setSidebar(!sidebar)}
        />
      </div>
      {/* <div>
        <IconButton
          icon={<Icon as={CgDarkMode} />}
          appearance="subtle"
          size="md"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      </div> */}
    </div>
  )
}

export default Navbar
