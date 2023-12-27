import { describe, expect, it } from "vitest"
import { todo } from "./index.js"

describe("index", () => {
  it("should work", () => {
    expect(todo()).toBe("TODO")
  })
})
