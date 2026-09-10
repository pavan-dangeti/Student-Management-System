import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCheck, Check, X, Clock } from "lucide-react"
import { useAttendanceFilters, type AttendanceRecord, type AttendanceStatus } from "@/hooks/useAttendance"
import { useAppData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { classIdFor, classLabelFor } from "@/lib/school"
import { ErrorBoundary } from "@/components/ErrorBoundary"

function getStatusBadge(status: AttendanceStatus) {
  switch (status) {
    case "present":
      return <Badge className="bg-green-100 text-green-800">Present</Badge>
    case "absent":
      return <Badge className="bg-red-100 text-red-800">Absent</Badge>
    case "late":
      return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
  }
}

function AttendanceRow({
  record,
  readOnly,
  onMark,
}: {
  record: AttendanceRecord
  readOnly: boolean
  onMark: (id: string, status: AttendanceStatus) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {record.rollNumber}
        </div>
        <div>
          <h3 className="font-medium">{record.name}</h3>
          <p className="text-sm text-muted-foreground">Roll No: {record.rollNumber}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">{record.timeIn}</span>
        {getStatusBadge(record.status)}
        {!readOnly && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-green-600" aria-label={`Mark ${record.name} present`} onClick={() => onMark(record.id, "present")}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-yellow-600" aria-label={`Mark ${record.name} late`} onClick={() => onMark(record.id, "late")}>
              <Clock className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-600" aria-label={`Mark ${record.name} absent`} onClick={() => onMark(record.id, "absent")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Attendance() {
  const { user } = useAuth()
  const { students, attendance, markAttendance, markAllPresent } = useAppData()
  const { selectedDate, setSelectedDate, selectedClass, setSelectedClass, visibleRecords } =
    useAttendanceFilters(attendance)

  const classOptions = useMemo(() => {
    const seen = new Map<string, string>()
    students.forEach((student) => {
      const id = classIdFor(student.grade, student.section)
      if (!seen.has(id)) {
        seen.set(id, classLabelFor(student.grade, student.section))
      }
    })
    return Array.from(seen.entries())
  }, [students])

  const isStudent = user?.role === "student"
  const myRecords = useMemo(
    () => visibleRecords.filter((record) => record.name.toLowerCase() === user?.name.toLowerCase()),
    [visibleRecords, user],
  )
  const displayedRecords = isStudent ? myRecords : visibleRecords

  const presentCount = displayedRecords.filter((r) => r.status === "present").length
  const absentCount = displayedRecords.filter((r) => r.status === "absent").length
  const lateCount = displayedRecords.filter((r) => r.status === "late").length
  const attendanceRate = displayedRecords.length > 0 ? Math.round((presentCount / displayedRecords.length) * 100) : 0

  return (
    <ErrorBoundary fallback={<div className="py-8 text-center">Error loading attendance data.</div>}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{isStudent ? "My Attendance" : "Attendance"}</h1>
            <p className="text-muted-foreground">
              {isStudent ? "Your attendance record" : "Track and manage student attendance"}
            </p>
          </div>

          {!isStudent && (
            <Button onClick={() => markAllPresent(displayedRecords.map((r) => r.id))} disabled={displayedRecords.length === 0}>
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark All Present
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <p className="text-xs text-muted-foreground">{attendanceRate}% attendance rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <p className="text-xs text-muted-foreground">Not present</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
              <p className="text-xs text-muted-foreground">Arrived late</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>{isStudent ? "Select a date to view your record" : "Mark attendance for the selected class and date"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-md border px-3 py-2"
              />

              {!isStudent && (
                <div className="w-[220px]">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classOptions.map(([id, label]) => (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {displayedRecords.map((record) => (
                <AttendanceRow key={record.id} record={record} readOnly={isStudent} onMark={markAttendance} />
              ))}

              {displayedRecords.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No attendance records for the selected date.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
