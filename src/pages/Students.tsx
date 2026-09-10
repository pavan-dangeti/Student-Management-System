import { useEffect, useState, type FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash, ShieldAlert } from "lucide-react"
import { useStudentFilters, type Student } from "@/hooks/useStudents"
import { useAppData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  grade: "",
  section: "",
  address: "",
  parentName: "",
  parentPhone: "",
}

type StudentForm = typeof emptyForm

function StudentDialogForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  form: StudentForm
  onChange: (field: keyof StudentForm, value: string) => void
  onSubmit: (event: FormEvent) => void
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder="Enter full name" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="Enter email" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="Enter phone number" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => onChange("dateOfBirth", e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="grade">Grade</Label>
          <div className="mt-2">
            <Select value={form.grade} onValueChange={(value) => onChange("grade", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
                <SelectItem value="Grade 10">Grade 10</SelectItem>
                <SelectItem value="Grade 11">Grade 11</SelectItem>
                <SelectItem value="Grade 12">Grade 12</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="section">Section</Label>
          <div className="mt-2">
            <Select value={form.section} onValueChange={(value) => onChange("section", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
                <SelectItem value="C">Section C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" value={form.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Enter full address" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="parent-name">Parent/Guardian Name</Label>
          <Input id="parent-name" value={form.parentName} onChange={(e) => onChange("parentName", e.target.value)} placeholder="Enter parent name" className="mt-2" />
        </div>
        <div>
          <Label htmlFor="parent-phone">Parent/Guardian Phone</Label>
          <Input id="parent-phone" value={form.parentPhone} onChange={(e) => onChange("parentPhone", e.target.value)} placeholder="Enter parent phone" className="mt-2" />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}

function StudentRow({
  student,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: {
  student: Student
  canEdit: boolean
  canDelete: boolean
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            {student.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{student.name}</h3>
          <p className="text-sm text-muted-foreground">
            {student.grade} - Section {student.section} | Roll No: {student.rollNumber}
          </p>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <Button size="sm" variant="outline" aria-label={`Edit ${student.name}`} onClick={() => onEdit(student)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="outline"
                className="text-destructive"
                aria-label={`Remove ${student.name}`}
                onClick={() => onDelete(student)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Students() {
  const { user } = useAuth()
  const { students, addStudent, updateStudent, deleteStudent } = useAppData()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearch = searchParams.get("search") ?? ""

  const {
    searchTerm,
    setSearchTerm,
    selectedGrade,
    setSelectedGrade,
    selectedStatus,
    setSelectedStatus,
    filteredStudents,
  } = useStudentFilters(students, initialSearch)

  const [dialogOpen, setDialogOpen] = useState(() => searchParams.get("action") === "add")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StudentForm>(emptyForm)

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setSearchParams((params) => {
        params.delete("action")
        return params
      })
    }
  }, [searchParams, setSearchParams])

  const updateField = (field: keyof StudentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const openAddDialog = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (student: Student) => {
    setEditingId(student.id)
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      grade: student.grade,
      section: student.section,
      address: student.address,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
    })
    setDialogOpen(true)
  }

  const handleDelete = (student: Student) => {
    if (window.confirm(`Remove ${student.name} from the student directory? This cannot be undone.`)) {
      deleteStudent(student.id)
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name || !form.email) {
      return
    }
    if (editingId) {
      updateStudent(editingId, form)
    } else {
      addStudent({
        ...form,
        grade: form.grade || "Grade 9",
        section: form.section || "A",
        rollNumber: String(Math.floor(1000 + Math.random() * 9000)),
        status: "active",
        admissionDate: new Date().toISOString().split("T")[0],
      })
    }
    setForm(emptyForm)
    setEditingId(null)
    setDialogOpen(false)
  }

  if (user?.role === "student") {
    const ownRecord = students.find((student) => student.name.toLowerCase() === user.name.toLowerCase())
    return (
      <div className="mx-auto max-w-xl space-y-4 py-12 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Student directory is staff-only</h1>
        <p className="text-muted-foreground">
          {ownRecord
            ? "You can view your own information on your profile page."
            : "Your account isn't linked to a directory record yet. Contact your school admin."}
        </p>
      </div>
    )
  }

  const isAdmin = user?.role === "admin"

  return (
    <ErrorBoundary fallback={<div className="py-8 text-center">Error loading student data.</div>}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Manage student information and records</p>
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) {
                setEditingId(null)
                setForm(emptyForm)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Student" : "Add New Student"}</DialogTitle>
                <DialogDescription>
                  {editingId ? "Update this student's information" : "Enter student information to create a new record"}
                </DialogDescription>
              </DialogHeader>
              <StudentDialogForm
                form={form}
                onChange={updateField}
                onSubmit={handleSubmit}
                onCancel={() => setDialogOpen(false)}
                submitLabel={editingId ? "Save Changes" : "Add Student"}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>Search and filter students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="w-[150px]">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="Grade 9">Grade 9</SelectItem>
                    <SelectItem value="Grade 10">Grade 10</SelectItem>
                    <SelectItem value="Grade 11">Grade 11</SelectItem>
                    <SelectItem value="Grade 12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[150px]">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  canEdit
                  canDelete={isAdmin}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                />
              ))}

              {filteredStudents.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No students found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  )
}
