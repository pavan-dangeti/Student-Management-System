import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

function getInitials(name: string | undefined) {
  if (!name) {
    return ""
  }
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const canSearchStudents = user?.role === "admin" || user?.role === "teacher"

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()
    if (!query.trim()) {
      return
    }
    navigate(`/students?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="flex-1">
          {canSearchStudents ? (
            <form onSubmit={handleSearch} className="relative max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, roll no, or email..."
                className="pl-8"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </form>
          ) : (
            <p className="text-sm font-medium text-muted-foreground">Welcome back, {user?.name.split(" ")[0]}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>

          <Button variant="ghost" size="icon" aria-label="Log out" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
