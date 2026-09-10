import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, UserCircle, GraduationCap } from "lucide-react"
import type { StudentUser } from "@/context/AuthContext"
import type { AttendanceRecord } from "@/hooks/useAttendance"

interface StudentDashboardProps {
  user: StudentUser
  attendance: AttendanceRecord[]
}

export default function StudentDashboard({ user, attendance }: StudentDashboardProps) {
  const navigate = useNavigate()
  const myRecords = attendance.filter((record) => record.name.toLowerCase() === user.name.toLowerCase())
  const presentCount = myRecords.filter((r) => r.status === "present").length
  const attendanceRate = myRecords.length > 0 ? Math.round((presentCount / myRecords.length) * 100) : 0
  const latest = myRecords[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">
          {user.grade} - Section {user.section} · Roll No: {user.rollNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
            <p className="mt-1 text-sm text-muted-foreground">Based on recorded days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Status</CardTitle>
            <GraduationCap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {latest ? (
              <Badge className="text-sm capitalize">{latest.status}</Badge>
            ) : (
              <p className="text-sm text-muted-foreground">Not recorded yet</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Class</CardTitle>
            <UserCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.grade} - {user.section}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Things you can do from here</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => navigate("/attendance")}
            className="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-muted"
          >
            <Calendar className="mb-2 h-6 w-6 text-primary" />
            <p className="font-semibold">View My Attendance</p>
            <p className="text-sm text-muted-foreground">See your day-by-day record</p>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-muted"
          >
            <UserCircle className="mb-2 h-6 w-6 text-primary" />
            <p className="font-semibold">My Profile</p>
            <p className="text-sm text-muted-foreground">Update your contact information</p>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
