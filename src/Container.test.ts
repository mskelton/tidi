import { expect, test } from "bun:test"
import { Container, Inject } from "./index.js"

test("should bind services", () => {
  const container = new Container()
  class Foo {
    type = "foo"
  }
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

  class Foo {
    type = "foo"

    constructor() {
      fooCount++
    }
  }

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

test("supports dependencies", () => {
  const container = new Container()

  class Foo {
    @Inject("bar") public bar: Bar
    type = "foo"
  }

  class Bar {
    type = "bar"
  }

  container.bind("foo", Foo)
  container.bind("bar", Bar)

  expect(container.get<Foo>("foo").type).toBe("foo")
  expect(container.get<Foo>("foo").bar.type).toBe("bar")
})

test("supports circular dependencies", () => {
  const container = new Container()

  class Foo {
    @Inject("bar") public bar: Bar
    type = "foo"
  }

  class Bar {
    @Inject("foo") public foo: Foo
    type = "bar"
  }

  container.bind("foo", Foo)
  container.bind("bar", Bar)

  expect(container.get<Foo>("foo").bar.type).toBe("bar")
  expect(container.get<Bar>("bar").foo.type).toBe("foo")
})

test("supports nested dependencies", () => {
  const container = new Container()

  class Foo {
    type = "foo"
  }

  class Bar {
    @Inject("foo") public two: Foo
    type = "bar"
  }

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

  class Foo {
    add(x: number, y: number) {
      return x + y
    }
  }

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
