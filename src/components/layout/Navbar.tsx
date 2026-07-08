import { useSidebar } from '@/store/useSidebar'
import { Icon, Menu as RSuiteMenu } from '@rsuite/icons'
import { forwardRef, useRef, type Ref } from 'react'
import type { WhisperInstance } from 'rsuite'
import { CgDarkMode, CgProfile } from 'react-icons/cg'
import { LuLogOut } from 'react-icons/lu'
import { Avatar, Center, IconButton, Menu, Popover, Whisper } from 'rsuite'
import { useTheme } from '@/store/useTheme'
import { useNavigate } from 'react-router'
import { useAuth } from '@/store/useAuth'
import { useMe } from '@/hooks/useUser'

// ---------------
// TYPES
// ---------------
interface MenuPopoverProps {
  onProfile: () => void
  onLogout: () => void
  onTheme: () => void
  isDark: boolean
}

const MenuPopover = forwardRef(
  (
    { onProfile, onLogout, onTheme, isDark, ...rest }: MenuPopoverProps,
    ref: Ref<HTMLDivElement>,
  ) => (
    <Popover ref={ref} {...rest} full>
      <Menu>
        <Menu.Item onClick={onProfile} icon={<Icon as={CgProfile} />}>
          Profile
        </Menu.Item>

        <Menu.Item onClick={onTheme} icon={<Icon as={CgDarkMode} />}>
          {isDark ? 'Light' : 'Dark'}
        </Menu.Item>

        <Menu.Item onClick={onLogout} icon={<Icon as={LuLogOut} />}>
          Logout
        </Menu.Item>
      </Menu>
    </Popover>
  ),
)

MenuPopover.displayName = 'MenuPopover'

const Navbar = () => {
  const { theme, setTheme } = useTheme() // Theme state
  const { sidebar, setSidebar } = useSidebar() // Sidebar toggle state
  const { data: meRes } = useMe()
  const avatar = meRes?.data?.avatar || ''
  const fullName = meRes?.data?.fullName || ''
  const logout = useAuth((state) => state.logout)
  const navigate = useNavigate()

  const whisperRef = useRef<WhisperInstance | null>(null)

  const closeMenu = () => whisperRef.current?.close()

  const handleProfileClick = () => {
    navigate('/profile')
    closeMenu()
  }

  const handleLogoutClick = () => {
    logout()
    navigate('/login', { replace: true })
    closeMenu()
  }

  const handleThemeClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex h-[50px] items-center justify-between bg-[#F7F7FA] px-1.5 shadow-xs dark:bg-[#1B1D24]">
      <div className="hidden md:block" />

      <div className="block md:hidden">
        <IconButton
          icon={<RSuiteMenu />}
          appearance="subtle"
          size="lg"
          onClick={() => setSidebar(!sidebar)}
        />
      </div>

      <div>
        <Whisper
          placement="bottomEnd"
          trigger="click"
          controlId="profile-menu"
          ref={whisperRef}
          speaker={
            <MenuPopover
              onProfile={handleProfileClick}
              onLogout={handleLogoutClick}
              onTheme={handleThemeClick}
              isDark={theme === 'dark'}
            />
          }
        >
          <Center>
            <Avatar src={avatar} size="sm">
              {fullName?.charAt(0) || 'S'}
            </Avatar>
          </Center>
        </Whisper>
      </div>
    </div>
  )
}

export default Navbar
