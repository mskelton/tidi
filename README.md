# TiDI

[![Build status](https://github.com/mskelton/tidi/workflows/Build/badge.svg)](https://github.com/mskelton/tidi/actions)
[![npm version](https://img.shields.io/npm/v/tidi)](https://www.npmjs.com/package/tidi)

Dead simple dependency injection.

## Installation

### npm

```sh
npm install tidi
```

### Yarn

```sh
yarn add tidi
```

### pnpm

```sh
pnpm add tidi
```

### bun

```sh
bun add tidi
```

## Why TiDI?

- It's small, ridiculously small (~600B minified)
- Designed specifically for classes, it's easy to understand and use

## Getting Started

TiDI (pronounced "tie dye") is comprised of two main pieces: containers and
injections. The container manage bound services and ensures services are only
constructed once and used everywhere in the container. Injections allow you to
use inject dependencies into your services.

The following example shows a basic example of creating a logging service and a
user service where the user service depends on the logging service.

```ts
import { Container, Inject, Injectable } from "tidi"

const container = new Container()

class LoggingService {}

@Injectable
class UserService {
  @Inject("LoggingService") private loggingService: LoggingService
}

container.bind("LoggingService", LoggingService)
container.bind("UserService", UserService)
```

With the container created and services bound, we can now get a services from
the IOC container using the `get` method.

```ts
const userService = container.get<UserService>("UserService")
```

Keep in mind that the `get` method should only be used in the root of your
application where you created your container. Services themselves should use
`@Inject` to inject other services.

### Constructor Injection

In certain cases, you may need to access injected services in the constructor.
To support this, you can use constructor injection.

```ts
@Injectable
class UserService {
  constructor(
    @Inject("LoggingService") private loggingService: LoggingService,
  ) {
    this.loggingService.log("In the constructor!")
  }
}
```

Both injection types are supported simultaneously, so you can mix and match in
the same class!

## TypeScript

To use TiDI with TypeScript, You'll want to enable the following properties:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "strictPropertyInitialization": false
  }
}
```

Setting `strictPropertyInitialization=false` is not necessarily required, but it
is highly recommended to prevent you from needing to type cast usages of
`@Inject`.

## FAQ

### Are Circular Dependencies Supported?

I really would like to support circular dependencies, but supporting them in a
way that doesn't have a pile of caveats is not worth it for this library given
the focus on simplicity and small size. It maybe supported in the future, but
for now it is not.
