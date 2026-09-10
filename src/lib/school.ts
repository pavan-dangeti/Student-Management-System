export function classIdFor(grade: string, section: string): string {
  const gradeNumber = grade.replace(/[^0-9]/g, "")
  return `grade-${gradeNumber}-${section.trim().toLowerCase()}`
}

export function classLabelFor(grade: string, section: string): string {
  return `${grade} - Section ${section.toUpperCase()}`
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0]
}
