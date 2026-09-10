import { useState, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth, type ProfileUpdate } from "@/context/AuthContext"
import { CheckCircle2 } from "lucide-react"

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
}

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<ProfileUpdate>({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    bio: user?.bio ?? "",
    department: user?.role === "admin" ? user.department : undefined,
    subject: user?.role === "teacher" ? user.subject : undefined,
    grade: user?.role === "student" ? user.grade : undefined,
    section: user?.role === "student" ? user.section : undefined,
    parentName: user?.role === "student" ? user.parentName : undefined,
    parentPhone: user?.role === "student" ? user.parentPhone : undefined,
  })

  if (!user) {
    return null
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  const handleChange = (field: keyof ProfileUpdate, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    updateProfile(form)
    setSaved(true)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">View and update your account details</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar size="lg">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <Badge className="ml-auto">{roleLabels[user.role]}</Badge>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your contact information and bio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} className="mt-2" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} className="mt-2" />
              </div>

              {user.role === "admin" && (
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={form.department ?? ""} onChange={(e) => handleChange("department", e.target.value)} className="mt-2" />
                </div>
              )}

              {user.role === "teacher" && (
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={form.subject ?? ""} onChange={(e) => handleChange("subject", e.target.value)} className="mt-2" />
                </div>
              )}

              {user.role === "student" && (
                <>
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Input id="grade" value={form.grade ?? ""} onChange={(e) => handleChange("grade", e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Input id="section" value={form.section ?? ""} onChange={(e) => handleChange("section", e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="parent-name">Parent/Guardian Name</Label>
                    <Input id="parent-name" value={form.parentName ?? ""} onChange={(e) => handleChange("parentName", e.target.value)} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="parent-phone">Parent/Guardian Phone</Label>
                    <Input id="parent-phone" value={form.parentPhone ?? ""} onChange={(e) => handleChange("parentPhone", e.target.value)} className="mt-2" />
                  </div>
                </>
              )}

              <div className="col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={form.bio ?? ""} onChange={(e) => handleChange("bio", e.target.value)} className="mt-2" rows={3} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit">Save Changes</Button>
              {saved && (
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
