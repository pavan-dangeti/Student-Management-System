import { createContext, useContext, useState, type ReactNode } from "react"

export type UserRole = "admin" | "teacher" | "student"

interface BaseUser {
  id: string
  name: string
  email: string
  role: UserRole
  phone: string
  bio: string
}

export interface AdminUser extends BaseUser {
  role: "admin"
  department: string
}

export interface TeacherUser extends BaseUser {
  role: "teacher"
  subject: string
  classes: string[]
}

export interface StudentUser extends BaseUser {
  role: "student"
  grade: string
  section: string
  rollNumber: string
  parentName: string
  parentPhone: string
}

export type User = AdminUser | TeacherUser | StudentUser

export type ProfileUpdate = Partial<Pick<User, "name" | "phone" | "bio">> &
  Partial<Pick<AdminUser, "department">> &
  Partial<Pick<TeacherUser, "subject" | "classes">> &
  Partial<Pick<StudentUser, "grade" | "section" | "parentName" | "parentPhone">>

interface AuthContextProps {
  user: User | null
  isAuthenticated: boolean
  authError: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
  updateProfile: (updates: ProfileUpdate) => void
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

const defaultUsers: Record<string, User> = {
  "admin@school.edu": {
    id: "1",
    name: "Avery Morgan",
    email: "admin@school.edu",
    role: "admin",
    phone: "555-0100",
    bio: "System administrator overseeing enrollment, staffing, and reporting.",
    department: "School Administration",
  },
  "teacher@school.edu": {
    id: "2",
    name: "Jordan Lee",
    email: "teacher@school.edu",
    role: "teacher",
    phone: "555-0200",
    bio: "Mathematics teacher focused on building strong problem-solving skills.",
    subject: "Mathematics",
    classes: ["grade-10-a", "grade-9-b"],
  },
  "student@school.edu": {
    id: "3",
    name: "Alice Johnson",
    email: "student@school.edu",
    role: "student",
    phone: "555-0101",
    bio: "Grade 10 student interested in science and robotics club.",
    grade: "Grade 10",
    section: "A",
    rollNumber: "1001",
    parentName: "Mark Johnson",
    parentPhone: "555-0102",
  },
}

const SESSION_KEY = "sms.auth.session"
const DIRECTORY_KEY = "sms.auth.directory"

function loadDirectory(): Record<string, User> {
  try {
    const raw = localStorage.getItem(DIRECTORY_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveDirectory(directory: Record<string, User>) {
  localStorage.setItem(DIRECTORY_KEY, JSON.stringify(directory))
}

function resolveUser(email: string): User | null {
  const key = email.toLowerCase()
  const base = defaultUsers[key]
  if (!base) {
    return null
  }
  const directory = loadDirectory()
  const saved = directory[key]
  return saved ? ({ ...base, ...saved } as User) : base
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) {
      return null
    }

    try {
      const parsed: User = JSON.parse(stored)
      const refreshed = resolveUser(parsed.email)
      return refreshed ?? parsed
    } catch {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  })
  const [authError, setAuthError] = useState<string | null>(null)

  const login = (email: string, password: string) => {
    if (!email.trim() || password.trim().length < 4) {
      setAuthError("Enter a valid email and a password of at least 4 characters.")
      return false
    }
    const foundUser = resolveUser(email)
    if (!foundUser) {
      setAuthError("No account found for that email. Use one of the demo accounts below.")
      return false
    }
    setAuthError(null)
    setUser(foundUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  const updateProfile = (updates: ProfileUpdate) => {
    setUser((prev) => {
      if (!prev) {
        return prev
      }
      const next = { ...prev, ...updates } as User
      localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      const directory = loadDirectory()
      directory[prev.email.toLowerCase()] = next
      saveDirectory(directory)
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, authError, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
