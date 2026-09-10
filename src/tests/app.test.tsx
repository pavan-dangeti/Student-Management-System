import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "@/App"
import { AuthProvider } from "@/context/AuthContext"
import { DataProvider } from "@/context/DataContext"

function renderApp() {
  return render(
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>,
  )
}

async function loginAs(email: string) {
  const emailInput = screen.getByLabelText("Email")
  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, email)
  await userEvent.type(screen.getByLabelText("Password"), "anything123")
  await userEvent.click(screen.getByRole("button", { name: "Sign In" }))
}

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.pushState({}, "", "/")
  })

  it("redirects an unauthenticated user to the login page", () => {
    renderApp()
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument()
  })

  it("logs in as admin and shows the admin dashboard", async () => {
    renderApp()
    await loginAs("admin@school.edu")
    expect(await screen.findByText("Admin Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Avery Morgan")).toBeInTheDocument()
  })

  it("logs in as teacher and shows the teacher dashboard", async () => {
    renderApp()
    await loginAs("teacher@school.edu")
    expect(await screen.findByText(/Welcome back, Jordan/)).toBeInTheDocument()
    expect(screen.getByText("My Classes")).toBeInTheDocument()
  })

  it("logs in as student and shows the student dashboard without student directory access", async () => {
    renderApp()
    await loginAs("student@school.edu")
    expect(await screen.findByRole("heading", { name: /Welcome back, Alice/ })).toBeInTheDocument()
    expect(screen.queryByText("Students")).not.toBeInTheDocument()
  })

  it("shows an error for an unknown account", async () => {
    renderApp()
    await loginAs("nobody@school.edu")
    expect(await screen.findByText(/No account found/)).toBeInTheDocument()
  })

  it("shows an error for a password that is too short", async () => {
    renderApp()
    await userEvent.type(screen.getByLabelText("Password"), "12")
    await userEvent.click(screen.getByRole("button", { name: "Sign In" }))
    expect(await screen.findByText(/at least 4 characters/)).toBeInTheDocument()
  })

  it("navigates to Students and adds a new student through the dialog", async () => {
    renderApp()
    await loginAs("admin@school.edu")

    await screen.findByText("Admin Dashboard")
    await userEvent.click(screen.getByText("Students"))

    expect(await screen.findByText("Student Directory")).toBeInTheDocument()
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: /Add Student/ }))
    const dialog = screen.getByRole("dialog")
    await userEvent.type(screen.getByLabelText("Full Name"), "New Kid")
    await userEvent.type(screen.getByLabelText("Email"), "newkid@school.edu")
    await userEvent.click(within(dialog).getByRole("button", { name: "Add Student" }))

    expect(await screen.findByText("New Kid")).toBeInTheDocument()
  })

  it("deletes a student as an admin after confirmation", async () => {
    const originalConfirm = window.confirm
    window.confirm = () => true

    renderApp()
    await loginAs("admin@school.edu")
    await screen.findByText("Admin Dashboard")
    await userEvent.click(screen.getByText("Students"))

    await screen.findByText("Alice Johnson")
    await userEvent.click(screen.getByRole("button", { name: "Remove Alice Johnson" }))

    expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument()
    window.confirm = originalConfirm
  })

  it("navigates to Attendance and marks a student present", async () => {
    renderApp()
    await loginAs("admin@school.edu")
    await screen.findByText("Admin Dashboard")
    await userEvent.click(screen.getByText("Attendance"))

    expect(await screen.findByText("Daily Attendance")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Mark Carol Williams present" }))
    expect(screen.getAllByText("Present").length).toBeGreaterThan(0)
  })

  it("updates the profile for the signed-in user", async () => {
    renderApp()
    await loginAs("teacher@school.edu")
    await screen.findByText(/Welcome back, Jordan/)
    await userEvent.click(screen.getByText("Profile"))

    const nameInput = await screen.findByLabelText("Full Name")
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, "Jordan Rivera")
    await userEvent.click(screen.getByRole("button", { name: "Save Changes" }))

    expect(await screen.findByText("Saved")).toBeInTheDocument()
  })
})
