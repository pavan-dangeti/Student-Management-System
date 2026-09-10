import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth, type UserRole } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { GraduationCap, ShieldCheck, BookOpen, User } from "lucide-react"

interface RolePreset {
  role: UserRole
  label: string
  email: string
  description: string
  icon: typeof ShieldCheck
}

const rolePresets: RolePreset[] = [
  {
    role: "admin",
    label: "Admin",
    email: "admin@school.edu",
    description: "Manage enrollment, staff, and school-wide records.",
    icon: ShieldCheck,
  },
  {
    role: "teacher",
    label: "Teacher",
    email: "teacher@school.edu",
    description: "Track attendance and manage your classes.",
    icon: BookOpen,
  },
  {
    role: "student",
    label: "Student",
    email: "student@school.edu",
    description: "View your profile and attendance record.",
    icon: User,
  },
]

export default function Login() {
  const [activeRole, setActiveRole] = useState<UserRole>("admin")
  const [email, setEmail] = useState(rolePresets[0].email)
  const [password, setPassword] = useState("")
  const { login, authError } = useAuth()
  const navigate = useNavigate()

  const activePreset = rolePresets.find((preset) => preset.role === activeRole) ?? rolePresets[0]

  const handleRoleSelect = (preset: RolePreset) => {
    setActiveRole(preset.role)
    setEmail(preset.email)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const success = login(email, password)
    if (success) {
      navigate("/", { replace: true })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-gradient-to-br from-primary to-blue-700 p-10 text-primary-foreground md:flex">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            <span className="text-xl font-bold">Student MS</span>
          </div>
          <div className="space-y-3">
            <activePreset.icon className="h-10 w-10" />
            <h2 className="text-2xl font-semibold">{activePreset.label} sign-in</h2>
            <p className="text-sm text-primary-foreground/80">{activePreset.description}</p>
          </div>
          <p className="text-xs text-primary-foreground/60">
            Each role opens a tailored workspace with the tools relevant to that account.
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
            {rolePresets.map((preset) => (
              <button
                key={preset.role}
                type="button"
                onClick={() => handleRoleSelect(preset)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  activeRole === preset.role
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={activeRole === preset.role}
              >
                <preset.icon className="h-4 w-4" />
                {preset.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="you@school.edu"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="••••••••"
                className="mt-2"
              />
            </div>
            {authError && <p className="text-sm text-destructive">{authError}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo account: {activePreset.email} — any password of 4+ characters.
          </p>
        </div>
      </div>
    </div>
  )
}
