import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students"
import Attendance from "./pages/Attendance"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import AppSidebar from "./components/AppSidebar"
import Header from "./components/Header"
import { useAuth } from "./context/AuthContext"

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedLayout>
              <Students />
            </ProtectedLayout>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedLayout>
              <Attendance />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
