import { describe, expect, test } from "bun:test"
import { Container, inject, injectable } from "../lib/index.js"

test("should bind services", () => {
  const container = new Container()

  @injectable("foo")
  class Foo {
    type = "foo"
  }

  @injectable("bar")
  class Bar {
    type = "bar"
  }

  container.bind(Foo)
  container.bind(Bar)

  expect(container.get<Foo>("foo").type).toBe("foo")
  expect(container.get<Bar>("bar").type).toBe("bar")
})

test("should re-use constructed instances", () => {
  const container = new Container()
  let fooCount = 0
  let barCount = 0

  @injectable("foo")
  class Foo {
    type = "foo"

    constructor() {
      fooCount++
    }
  }

  @injectable("bar")
  class Bar {
    type = "bar"

    constructor() {
      barCount++
    }
  }

  container.bind(Foo, Bar)
  expect(container.get<Foo>("foo").type).toBe("foo")
  expect(container.get<Foo>("foo").type).toBe("foo")
  expect(container.get<Bar>("bar").type).toBe("bar")
  expect(container.get<Bar>("bar").type).toBe("bar")
  expect(fooCount).toBe(1)
  expect(barCount).toBe(1)
})

describe("properties", () => {
  test("supports dependencies", () => {
    const container = new Container()

    @injectable("foo")
    class Foo {
      @inject("bar") public bar: Bar
      type = "foo"
    }

    @injectable("bar")
    class Bar {
      type = "bar"
    }

    container.bind(Foo)
    container.bind(Bar)

    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Foo>("foo").bar.type).toBe("bar")
  })

  test("supports nested dependencies", () => {
    const container = new Container()

    @injectable("foo")
    class Foo {
      type = "foo"
    }

    @injectable("bar")
    class Bar {
      @inject("foo") public two: Foo
      type = "bar"
    }

    @injectable("baz")
    class Baz {
      @inject("bar") public three: Bar
      type = "baz"
    }

    container.bind(Foo, Bar, Baz)
    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Bar>("bar").two.type).toBe("foo")
    expect(container.get<Baz>("baz").three.type).toBe("bar")
    expect(container.get<Baz>("baz").three.two.type).toBe("foo")
  })

  test("accessing services", () => {
    const container = new Container()

    @injectable("foo")
    class Foo {
      add(x: number, y: number) {
        return x + y
      }
    }

    @injectable("bar")
    class Bar {
      @inject("foo") public foo: Foo

      doAdd() {
        return this.foo.add(1, 2)
      }
    }

    container.bind(Foo, Bar)
    expect(container.get<Bar>("bar").doAdd()).toBe(3)
  })
})

describe("constructor params", () => {
  test("supports dependencies", () => {
    const container = new Container()

    @injectable("foo")
    class Foo {
      type = "foo"
      constructor(@inject("bar") public bar: Bar) {}
    }

    @injectable("bar")
    class Bar {
      type = "bar"
    }

    container.bind(Foo, Bar)
    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Foo>("foo").bar.type).toBe("bar")
  })

  test("supports nested dependencies", () => {
    const container = new Container()

    @injectable("foo")
    class Foo {
      type = "foo"
    }

    @injectable("bar")
    class Bar {
      type = "bar"
      constructor(@inject("foo") public two: Foo) {}
    }

    @injectable("baz")
    class Baz {
      type = "baz"
      constructor(@inject("bar") public three: Bar) {}
    }

    container.bind(Foo, Bar, Baz)
    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Bar>("bar").two.type).toBe("foo")
    expect(container.get<Baz>("baz").three.type).toBe("bar")
    expect(container.get<Baz>("baz").three.two.type).toBe("foo")
  })

  test("accessing services", () => {
    const container = new Container()

    @injectable("foo")
    class Foo {
      add(x: number, y: number) {
        return x + y
      }
    }

    @injectable("bar")
    class Bar {
      constructor(@inject("foo") public foo: Foo) {}

      doAdd() {
        return this.foo.add(1, 2)
      }
    }

    container.bind(Foo, Bar)
    expect(container.get<Bar>("bar").doAdd()).toBe(3)
  })
})
