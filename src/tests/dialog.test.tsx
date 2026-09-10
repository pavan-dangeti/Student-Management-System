import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"

describe("Dialog", () => {
  it("opens on trigger click and closes on backdrop click", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    )

    expect(screen.queryByText("My Dialog")).not.toBeInTheDocument()

    await userEvent.click(screen.getByText("Open"))
    expect(screen.getByText("My Dialog")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("dialog").parentElement as HTMLElement)
    expect(screen.queryByText("My Dialog")).not.toBeInTheDocument()
  })
})
