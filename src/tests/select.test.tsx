import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

describe("Select", () => {
  it("opens, selects a value, and calls onValueChange", async () => {
    const handleChange = vi.fn()
    render(
      <Select value={undefined} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="grade-9">Grade 9</SelectItem>
          <SelectItem value="grade-10">Grade 10</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByText("Pick one")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button"))
    await userEvent.click(screen.getByText("Grade 10"))

    expect(handleChange).toHaveBeenCalledWith("grade-10")
  })
})
