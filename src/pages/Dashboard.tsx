import { useAuth } from "@/context/AuthContext"
import { useAppData } from "@/context/DataContext"
import AdminDashboard from "@/pages/dashboards/AdminDashboard"
import TeacherDashboard from "@/pages/dashboards/TeacherDashboard"
import StudentDashboard from "@/pages/dashboards/StudentDashboard"

export default function Dashboard() {
  const { user } = useAuth()
  const { students, attendance, activity } = useAppData()

  if (!user) {
    return null
  }

  if (user.role === "admin") {
    return <AdminDashboard students={students} attendance={attendance} activity={activity} />
  }

  if (user.role === "teacher") {
    return <TeacherDashboard user={user} students={students} attendance={attendance} />
  }

  return <StudentDashboard user={user} attendance={attendance} />
}
