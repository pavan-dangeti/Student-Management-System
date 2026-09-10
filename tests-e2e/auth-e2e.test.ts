import { test, expect } from "@playwright/test"

test("logs in with a valid demo account and reaches the dashboard", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Email").fill("admin@school.edu")
  await page.getByLabel("Password").fill("password")
  await page.getByRole("button", { name: "Sign In" }).click()
  await expect(page).toHaveURL("/")
  await expect(page.getByText("Admin Dashboard")).toBeVisible()
})

test("shows an error for an unknown account", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Email").fill("nobody@school.edu")
  await page.getByLabel("Password").fill("password")
  await page.getByRole("button", { name: "Sign In" }).click()
  await expect(page.getByText(/No account found/)).toBeVisible()
})

test("unauthenticated user is redirected to login", async ({ page }) => {
  await page.goto("/students")
  await expect(page).toHaveURL("/login")
})

test("student account cannot reach the staff-only student directory", async ({ page }) => {
  await page.goto("/login")
  await page.getByLabel("Email").fill("student@school.edu")
  await page.getByLabel("Password").fill("password")
  await page.getByRole("button", { name: "Sign In" }).click()
  await page.goto("/students")
  await expect(page.getByText("Student directory is staff-only")).toBeVisible()
})
