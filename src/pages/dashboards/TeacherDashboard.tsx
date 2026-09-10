import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BookOpen } from "lucide-react"
import type { TeacherUser } from "@/context/AuthContext"
import type { Student } from "@/hooks/useStudents"
import type { AttendanceRecord } from "@/hooks/useAttendance"
import { classIdFor, classLabelFor } from "@/lib/school"

interface TeacherDashboardProps {
  user: TeacherUser
  students: Student[]
  attendance: AttendanceRecord[]
}

export default function TeacherDashboard({ user, students, attendance }: TeacherDashboardProps) {
  const navigate = useNavigate()
  const myClasses = user.classes
  const myStudents = students.filter((student) => myClasses.includes(classIdFor(student.grade, student.section)))
  const myAttendance = attendance.filter((record) => myClasses.includes(record.classId))
  const presentCount = myAttendance.filter((r) => r.status === "present").length
  const attendanceRate = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground">{user.subject} — here is what's happening in your classes</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Students</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myStudents.length}</div>
            <p className="mt-1 text-sm text-muted-foreground">Across {myClasses.length} class(es)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Attendance</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceRate}%</div>
            <p className="mt-1 text-sm text-muted-foreground">{presentCount} of {myAttendance.length} present</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subject</CardTitle>
            <BookOpen className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.subject}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Classes</CardTitle>
          <CardDescription>Sections you currently teach</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {myClasses.map((classId) => {
            const sample = students.find((student) => classIdFor(student.grade, student.section) === classId)
            const label = sample ? classLabelFor(sample.grade, sample.section) : classId
            const count = students.filter((student) => classIdFor(student.grade, student.section) === classId).length
            return (
              <div key={classId} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{count} student(s)</p>
                </div>
                <Badge variant="outline">{classId}</Badge>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/attendance")}
          className="flex-1 rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-muted"
        >
          <Calendar className="mb-2 h-6 w-6 text-primary" />
          <p className="font-semibold">Mark Attendance</p>
          <p className="text-sm text-muted-foreground">Go to today's attendance sheet</p>
        </button>
        <button
          onClick={() => navigate("/students")}
          className="flex-1 rounded-lg border p-4 text-left transition-colors hover:border-primary hover:bg-muted"
        >
          <Users className="mb-2 h-6 w-6 text-primary" />
          <p className="font-semibold">View Students</p>
          <p className="text-sm text-muted-foreground">Browse the student directory</p>
        </button>
      </div>
    </div>
  )
}
