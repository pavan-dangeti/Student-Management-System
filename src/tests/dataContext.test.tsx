import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import type { ReactNode } from "react"
import { DataProvider, useAppData } from "@/context/DataContext"
import { defaultStudents } from "@/hooks/useStudents"

const wrapper = ({ children }: { children: ReactNode }) => <DataProvider>{children}</DataProvider>

describe("DataContext", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it("seeds students and attendance from defaults", () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    expect(result.current.students).toHaveLength(defaultStudents.length)
    expect(result.current.attendance).toHaveLength(defaultStudents.length)
  })

  it("adds a student and a matching attendance record", () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    act(() =>
      result.current.addStudent({
        name: "New Student",
        email: "new@school.edu",
        phone: "555-9999",
        grade: "Grade 9",
        section: "A",
        rollNumber: "2001",
        dateOfBirth: "2010-01-01",
        address: "1 Test Way",
        parentName: "Parent",
        parentPhone: "555-8888",
        status: "active",
        admissionDate: "2024-01-01",
      }),
    )
    expect(result.current.students).toHaveLength(defaultStudents.length + 1)
    expect(result.current.attendance.some((record) => record.name === "New Student")).toBe(true)
    expect(result.current.activity[0].message).toContain("New Student")
  })

  it("updates a student's details", () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    const target = result.current.students[0]
    act(() => result.current.updateStudent(target.id, { name: "Updated Name" }))
    expect(result.current.students[0].name).toBe("Updated Name")
  })

  it("deletes a student and its attendance record", () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    const target = result.current.students[0]
    act(() => result.current.deleteStudent(target.id))
    expect(result.current.students.find((s) => s.id === target.id)).toBeUndefined()
    expect(result.current.attendance.find((a) => a.studentId === target.id)).toBeUndefined()
  })

  it("marks attendance status for a student", () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    const record = result.current.attendance[0]
    act(() => result.current.markAttendance(record.id, "late"))
    expect(result.current.attendance.find((a) => a.id === record.id)?.status).toBe("late")
  })

  it("marks all visible records present", () => {
    const { result } = renderHook(() => useAppData(), { wrapper })
    const ids = result.current.attendance.map((a) => a.id)
    act(() => result.current.markAllPresent(ids))
    expect(result.current.attendance.every((a) => a.status === "present")).toBe(true)
  })
})
