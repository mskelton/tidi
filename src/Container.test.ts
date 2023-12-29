import { describe, expect, test } from "bun:test"
import { Container, Inject, Injectable } from "./index.js"

test("should bind services", () => {
  const container = new Container()

  @Injectable("foo")
  class Foo {
    type = "foo"
  }

  @Injectable("bar")
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

  @Injectable("foo")
  class Foo {
    type = "foo"

    constructor() {
      fooCount++
    }
  }

  @Injectable("bar")
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

    @Injectable("foo")
    class Foo {
      @Inject("bar") public bar: Bar
      type = "foo"
    }

    @Injectable("bar")
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

    @Injectable("foo")
    class Foo {
      type = "foo"
    }

    @Injectable("bar")
    class Bar {
      @Inject("foo") public two: Foo
      type = "bar"
    }

    @Injectable("baz")
    class Baz {
      @Inject("bar") public three: Bar
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

    @Injectable("foo")
    class Foo {
      add(x: number, y: number) {
        return x + y
      }
    }

    @Injectable("bar")
    class Bar {
      @Inject("foo") public foo: Foo

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

    @Injectable("foo")
    class Foo {
      type = "foo"
      constructor(@Inject("bar") public bar: Bar) {}
    }

    @Injectable("bar")
    class Bar {
      type = "bar"
    }

    container.bind(Foo, Bar)
    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Foo>("foo").bar.type).toBe("bar")
  })

  test("supports nested dependencies", () => {
    const container = new Container()

    @Injectable("foo")
    class Foo {
      type = "foo"
    }

    @Injectable("bar")
    class Bar {
      type = "bar"
      constructor(@Inject("foo") public two: Foo) {}
    }

    @Injectable("baz")
    class Baz {
      type = "baz"
      constructor(@Inject("bar") public three: Bar) {}
    }

    container.bind(Foo, Bar, Baz)
    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Bar>("bar").two.type).toBe("foo")
    expect(container.get<Baz>("baz").three.type).toBe("bar")
    expect(container.get<Baz>("baz").three.two.type).toBe("foo")
  })

  test("accessing services", () => {
    const container = new Container()

    @Injectable("foo")
    class Foo {
      add(x: number, y: number) {
        return x + y
      }
    }

    @Injectable("bar")
    class Bar {
      constructor(@Inject("foo") public foo: Foo) {}

      doAdd() {
        return this.foo.add(1, 2)
      }
    }

    container.bind(Foo, Bar)
    expect(container.get<Bar>("bar").doAdd()).toBe(3)
  })
})
