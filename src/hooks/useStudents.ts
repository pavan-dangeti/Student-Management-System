import { useMemo, useState } from "react"

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  grade: string
  section: string
  rollNumber: string
  dateOfBirth: string
  address: string
  parentName: string
  parentPhone: string
  status: "active" | "inactive"
  admissionDate: string
}

export const defaultStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@school.edu",
    phone: "555-0101",
    grade: "Grade 10",
    section: "A",
    rollNumber: "1001",
    dateOfBirth: "2009-03-12",
    address: "12 Maple Street",
    parentName: "Mark Johnson",
    parentPhone: "555-0102",
    status: "active",
    admissionDate: "2023-06-01",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@school.edu",
    phone: "555-0201",
    grade: "Grade 9",
    section: "B",
    rollNumber: "0932",
    dateOfBirth: "2010-07-24",
    address: "44 Oak Avenue",
    parentName: "Diane Smith",
    parentPhone: "555-0202",
    status: "active",
    admissionDate: "2023-06-01",
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.williams@school.edu",
    phone: "555-0301",
    grade: "Grade 11",
    section: "A",
    rollNumber: "1104",
    dateOfBirth: "2008-11-02",
    address: "9 Birch Lane",
    parentName: "Frank Williams",
    parentPhone: "555-0302",
    status: "inactive",
    admissionDate: "2022-06-01",
  },
  {
    id: "4",
    name: "Daniel Lee",
    email: "daniel.lee@school.edu",
    phone: "555-0401",
    grade: "Grade 10",
    section: "B",
    rollNumber: "1042",
    dateOfBirth: "2009-01-19",
    address: "77 Cedar Court",
    parentName: "Grace Lee",
    parentPhone: "555-0402",
    status: "active",
    admissionDate: "2023-06-01",
  },
]

export interface UseStudentFiltersResult {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedGrade: string
  setSelectedGrade: (grade: string) => void
  selectedStatus: string
  setSelectedStatus: (status: string) => void
  filteredStudents: Student[]
}

export function useStudentFilters(students: Student[], initialSearchTerm = ""): UseStudentFiltersResult {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch =
        term.length === 0 ||
        student.name.toLowerCase().includes(term) ||
        student.rollNumber.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      const matchesGrade = selectedGrade === "all" || student.grade === selectedGrade
      const matchesStatus = selectedStatus === "all" || student.status === selectedStatus
      return matchesSearch && matchesGrade && matchesStatus
    })
  }, [students, searchTerm, selectedGrade, selectedStatus])

  return {
    searchTerm,
    setSearchTerm,
    selectedGrade,
    setSelectedGrade,
    selectedStatus,
    setSelectedStatus,
    filteredStudents,
  }
}
