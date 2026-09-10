import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, UserCog, TrendingUp } from "lucide-react"
import type { ActivityEntry } from "@/context/DataContext"
import type { Student } from "@/hooks/useStudents"
import type { AttendanceRecord } from "@/hooks/useAttendance"

const TOTAL_STAFF = 18

interface AdminDashboardProps {
  students: Student[]
  attendance: AttendanceRecord[]
  activity: ActivityEntry[]
}

export default function AdminDashboard({ students, attendance, activity }: AdminDashboardProps) {
  const navigate = useNavigate()
  const activeStudents = students.filter((s) => s.status === "active").length
  const presentToday = attendance.filter((a) => a.status === "present").length
  const attendanceRate = attendance.length > 0 ? Math.round((presentToday / attendance.length) * 100) : 0

  const stats = [
    { title: "Total Students", value: String(students.length), description: `${activeStudents} active`, icon: Users },
    { title: "Attendance Today", value: `${attendanceRate}%`, description: "Across all classes", icon: Calendar },
    { title: "Staff Members", value: String(TOTAL_STAFF), description: "Teaching & admin staff", icon: UserCog },
    { title: "Enrollment Trend", value: "+12%", description: "Vs. last semester", icon: TrendingUp },
  ]

  const quickActions = [
    { label: "Add Student", description: "Register a new student", icon: Users, onClick: () => navigate("/students?action=add") },
    { label: "Mark Attendance", description: "Go to daily attendance", icon: Calendar, onClick: () => navigate("/attendance") },
    { label: "Manage Directory", description: "View and edit students", icon: UserCog, onClick: () => navigate("/students") },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">School-wide overview and management tools</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet. Actions you take will appear here.</p>
            ) : (
              <div className="space-y-3">
                {activity.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted">
                    <p className="text-sm">{entry.message}</p>
                    <Badge variant="outline" className="text-xs">
                      {entry.timestamp}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-muted"
              >
                <action.icon className="mb-2 h-6 w-6 text-primary" />
                <p className="font-semibold">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
