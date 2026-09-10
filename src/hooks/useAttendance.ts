import { useMemo, useState } from "react"
import { classIdFor, todayISO } from "@/lib/school"
import { defaultStudents } from "@/hooks/useStudents"

export type AttendanceStatus = "present" | "absent" | "late"

export interface AttendanceRecord {
  id: string
  studentId: string
  name: string
  rollNumber: string
  classId: string
  date: string
  status: AttendanceStatus
  timeIn: string
}

const seedTimes = ["08:02 AM", "08:41 AM", "-", "07:58 AM"]
const seedStatuses: AttendanceStatus[] = ["present", "late", "absent", "present"]

export const defaultAttendance: AttendanceRecord[] = defaultStudents.map((student, index) => ({
  id: student.id,
  studentId: student.id,
  name: student.name,
  rollNumber: student.rollNumber,
  classId: classIdFor(student.grade, student.section),
  date: todayISO(),
  status: seedStatuses[index] ?? "present",
  timeIn: seedTimes[index] ?? "-",
}))

export interface UseAttendanceFiltersResult {
  selectedDate: string
  setSelectedDate: (date: string) => void
  selectedClass: string
  setSelectedClass: (classId: string) => void
  visibleRecords: AttendanceRecord[]
}

export function useAttendanceFilters(records: AttendanceRecord[]): UseAttendanceFiltersResult {
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [selectedClass, setSelectedClass] = useState("all")

  const visibleRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesDate = record.date === selectedDate
      const matchesClass = selectedClass === "all" || record.classId === selectedClass
      return matchesDate && matchesClass
    })
  }, [records, selectedDate, selectedClass])

  return { selectedDate, setSelectedDate, selectedClass, setSelectedClass, visibleRecords }
}
