import { NavLink } from "react-router-dom"
import { Home, Users, Calendar, GraduationCap, UserCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"

interface NavItem {
  title: string
  url: string
  icon: typeof Home
}

const baseNavItems: NavItem[] = [{ title: "Dashboard", url: "/", icon: Home }]
const staffNavItems: NavItem[] = [
  { title: "Students", url: "/students", icon: Users },
  { title: "Attendance", url: "/attendance", icon: Calendar },
]
const studentNavItems: NavItem[] = [{ title: "Attendance", url: "/attendance", icon: Calendar }]
const profileNavItem: NavItem = { title: "Profile", url: "/profile", icon: UserCircle }

export default function AppSidebar() {
  const { collapsed, setCollapsed } = useSidebar()
  const { user } = useAuth()

  const roleNavItems = user?.role === "student" ? studentNavItems : staffNavItems
  const navigationItems = [...baseNavItems, ...roleNavItems, profileNavItem]

  return (
    <Sidebar collapsed={collapsed}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Student MS</span>
          </div>
        )}
        <SidebarTrigger onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
