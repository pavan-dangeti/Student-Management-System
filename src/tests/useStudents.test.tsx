import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useStudentFilters, type Student } from "@/hooks/useStudents"

const buildStudents = (): Student[] => [
  {
    id: "1",
    name: "Alice",
    email: "alice@test.com",
    phone: "123",
    grade: "Grade 9",
    section: "A",
    rollNumber: "1",
    dateOfBirth: "2000-01-01",
    address: "Addr",
    parentName: "P",
    parentPhone: "P",
    status: "active",
    admissionDate: "2024-01-01",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@test.com",
    phone: "456",
    grade: "Grade 10",
    section: "B",
    rollNumber: "2",
    dateOfBirth: "2000-01-01",
    address: "Addr",
    parentName: "P",
    parentPhone: "P",
    status: "inactive",
    admissionDate: "2024-01-01",
  },
]

describe("useStudentFilters", () => {
  it("returns all students when no filters are applied", () => {
    const { result } = renderHook(() => useStudentFilters(buildStudents()))
    expect(result.current.filteredStudents).toHaveLength(2)
  })

  it("filters students by search term", () => {
    const { result } = renderHook(() => useStudentFilters(buildStudents()))
    act(() => result.current.setSearchTerm("Alice"))
    expect(result.current.filteredStudents).toHaveLength(1)
    expect(result.current.filteredStudents[0].name).toBe("Alice")
  })

  it("filters students by grade", () => {
    const { result } = renderHook(() => useStudentFilters(buildStudents()))
    act(() => result.current.setSelectedGrade("Grade 9"))
    expect(result.current.filteredStudents).toHaveLength(1)
    expect(result.current.filteredStudents[0].grade).toBe("Grade 9")
  })

  it("filters students by status", () => {
    const { result } = renderHook(() => useStudentFilters(buildStudents()))
    act(() => result.current.setSelectedStatus("inactive"))
    expect(result.current.filteredStudents).toHaveLength(1)
    expect(result.current.filteredStudents[0].name).toBe("Bob")
  })

  it("combines multiple filters", () => {
    const { result } = renderHook(() => useStudentFilters(buildStudents()))
    act(() => {
      result.current.setSearchTerm("bob")
      result.current.setSelectedStatus("inactive")
    })
    expect(result.current.filteredStudents).toHaveLength(1)
    expect(result.current.filteredStudents[0].name).toBe("Bob")
  })

  it("seeds the initial search term when provided", () => {
    const { result } = renderHook(() => useStudentFilters(buildStudents(), "Alice"))
    expect(result.current.filteredStudents).toHaveLength(1)
    expect(result.current.filteredStudents[0].name).toBe("Alice")
  })
})
