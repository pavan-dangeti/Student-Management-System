import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { defaultStudents, type Student } from "@/hooks/useStudents"
import { defaultAttendance, type AttendanceRecord, type AttendanceStatus } from "@/hooks/useAttendance"
import { classIdFor, todayISO } from "@/lib/school"

export interface ActivityEntry {
  id: string
  message: string
  timestamp: string
}

interface DataContextProps {
  students: Student[]
  addStudent: (student: Omit<Student, "id">) => void
  updateStudent: (id: string, updates: Partial<Omit<Student, "id">>) => void
  deleteStudent: (id: string) => void
  attendance: AttendanceRecord[]
  markAttendance: (id: string, status: AttendanceStatus) => void
  markAllPresent: (visibleIds: string[]) => void
  activity: ActivityEntry[]
}

const DataContext = createContext<DataContextProps | undefined>(undefined)

const STUDENTS_KEY = "sms.data.students"
const ATTENDANCE_KEY = "sms.data.attendance"
const ACTIVITY_KEY = "sms.data.activity"
const MAX_ACTIVITY_ENTRIES = 8

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function currentTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage(STUDENTS_KEY, defaultStudents))
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() =>
    loadFromStorage(ATTENDANCE_KEY, defaultAttendance),
  )
  const [activity, setActivity] = useState<ActivityEntry[]>(() => loadFromStorage(ACTIVITY_KEY, []))

  useEffect(() => {
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students))
  }, [students])

  useEffect(() => {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendance))
  }, [attendance])

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity))
  }, [activity])

  const logActivity = (message: string) => {
    setActivity((prev) => [{ id: crypto.randomUUID(), message, timestamp: currentTime() }, ...prev].slice(0, MAX_ACTIVITY_ENTRIES))
  }

  const addStudent = (student: Omit<Student, "id">) => {
    const id = crypto.randomUUID()
    setStudents((prev) => [...prev, { ...student, id }])
    setAttendance((prev) => [
      ...prev,
      {
        id,
        studentId: id,
        name: student.name,
        rollNumber: student.rollNumber,
        classId: classIdFor(student.grade, student.section),
        date: todayISO(),
        status: "present",
        timeIn: "-",
      },
    ])
    logActivity(`New student enrolled: ${student.name}`)
  }

  const updateStudent = (id: string, updates: Partial<Omit<Student, "id">>) => {
    setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, ...updates } : student)))
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === id
          ? {
              ...record,
              name: updates.name ?? record.name,
              rollNumber: updates.rollNumber ?? record.rollNumber,
              classId:
                updates.grade || updates.section
                  ? classIdFor(
                      updates.grade ?? record.classId,
                      updates.section ?? record.classId,
                    )
                  : record.classId,
            }
          : record,
      ),
    )
    const updatedName = updates.name ?? students.find((student) => student.id === id)?.name ?? "Student"
    logActivity(`Record updated: ${updatedName}`)
  }

  const deleteStudent = (id: string) => {
    const removed = students.find((student) => student.id === id)
    setStudents((prev) => prev.filter((student) => student.id !== id))
    setAttendance((prev) => prev.filter((record) => record.studentId !== id))
    if (removed) {
      logActivity(`Student removed: ${removed.name}`)
    }
  }

  const markAttendance = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, status, timeIn: status === "absent" ? "-" : currentTime() }
          : record,
      ),
    )
    const target = attendance.find((record) => record.id === id)
    if (target) {
      logActivity(`${target.name} marked ${status}`)
    }
  }

  const markAllPresent = (visibleIds: string[]) => {
    setAttendance((prev) =>
      prev.map((record) =>
        visibleIds.includes(record.id) ? { ...record, status: "present", timeIn: currentTime() } : record,
      ),
    )
    logActivity(`Attendance marked present for ${visibleIds.length} student(s)`)
  }

  return (
    <DataContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        attendance,
        markAttendance,
        markAllPresent,
        activity,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useAppData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useAppData must be used within a DataProvider")
  }
  return context
}
