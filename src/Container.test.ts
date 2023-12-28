import { describe, expect, test } from "bun:test"
import { Container, Inject, Injectable } from "./index.js"

test("should bind services", () => {
  const container = new Container()

  @Injectable
  class Foo {
    type = "foo"
  }

  @Injectable
  class Bar {
    type = "bar"
  }

  container.bind("foo", Foo)
  container.bind("bar", Bar)

  expect(container.get<Foo>("foo").type).toBe("foo")
  expect(container.get<Bar>("bar").type).toBe("bar")
})

test("should re-use constructed instances", () => {
  const container = new Container()
  let fooCount = 0
  let barCount = 0

  @Injectable
  class Foo {
    type = "foo"

    constructor() {
      fooCount++
    }
  }

  @Injectable
  class Bar {
    type = "bar"

    constructor() {
      barCount++
    }
  }

  container.bind("foo", Foo)
  container.bind("bar", Bar)

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

    @Injectable
    class Foo {
      @Inject("bar") public bar: Bar
      type = "foo"
    }

    @Injectable
    class Bar {
      type = "bar"
    }

    container.bind("foo", Foo)
    container.bind("bar", Bar)

    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Foo>("foo").bar.type).toBe("bar")
  })

  test("supports nested dependencies", () => {
    const container = new Container()

    @Injectable
    class Foo {
      type = "foo"
    }

    @Injectable
    class Bar {
      @Inject("foo") public two: Foo
      type = "bar"
    }

    @Injectable
    class Baz {
      @Inject("bar") public three: Bar
      type = "baz"
    }

    container.bind("foo", Foo)
    container.bind("bar", Bar)
    container.bind("baz", Baz)

    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Bar>("bar").two.type).toBe("foo")
    expect(container.get<Baz>("baz").three.type).toBe("bar")
    expect(container.get<Baz>("baz").three.two.type).toBe("foo")
  })

  test("accessing services", () => {
    const container = new Container()

    @Injectable
    class Foo {
      add(x: number, y: number) {
        return x + y
      }
    }

    @Injectable
    class Bar {
      @Inject("foo") public foo: Foo

      doAdd() {
        return this.foo.add(1, 2)
      }
    }

    container.bind("foo", Foo)
    container.bind("bar", Bar)

    expect(container.get<Bar>("bar").doAdd()).toBe(3)
  })
})

describe("constructor params", () => {
  test("supports dependencies", () => {
    const container = new Container()

    @Injectable
    class Foo {
      type = "foo"
      constructor(@Inject("bar") public bar: Bar) {}
    }

    @Injectable
    class Bar {
      type = "bar"
    }

    container.bind("foo", Foo)
    container.bind("bar", Bar)

    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Foo>("foo").bar.type).toBe("bar")
  })

  test("supports nested dependencies", () => {
    const container = new Container()

    @Injectable
    class Foo {
      type = "foo"
    }

    @Injectable
    class Bar {
      type = "bar"
      constructor(@Inject("foo") public two: Foo) {}
    }

    @Injectable
    class Baz {
      type = "baz"
      constructor(@Inject("bar") public three: Bar) {}
    }

    container.bind("foo", Foo)
    container.bind("bar", Bar)
    container.bind("baz", Baz)

    expect(container.get<Foo>("foo").type).toBe("foo")
    expect(container.get<Bar>("bar").two.type).toBe("foo")
    expect(container.get<Baz>("baz").three.type).toBe("bar")
    expect(container.get<Baz>("baz").three.two.type).toBe("foo")
  })

  test("accessing services", () => {
    const container = new Container()

    @Injectable
    class Foo {
      add(x: number, y: number) {
        return x + y
      }
    }

    @Injectable
    class Bar {
      constructor(@Inject("foo") public foo: Foo) {}

      doAdd() {
        return this.foo.add(1, 2)
      }
    }

    container.bind("foo", Foo)
    container.bind("bar", Bar)

    expect(container.get<Bar>("bar").doAdd()).toBe(3)
  })
})
