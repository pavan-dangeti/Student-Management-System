import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

describe("Card", () => {
  it("renders content correctly", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>X</CardTitle>
        </CardHeader>
      </Card>,
    )
    expect(screen.getByTestId("card")).toBeInTheDocument()
    expect(screen.getByText("X")).toBeInTheDocument()
  })
})
