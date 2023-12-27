# tidi

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

## Getting Started

tidi is comprised of two main pieces: containers and injections. The container
manage bound services and ensures services are only constructed once and used
everywhere in the container. Injections allow you to use inject dependencies
into your services.

The following example shows a basic example of creating a logging service and a
user service where the user service depends on the logging service.

```ts
const container = new Container()

class LoggingService {}

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

## TypeScript

To use tidi with TypeScript, You'll want to enable the following properties:

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

## FAQs

### Are Circular Dependencies Supported?

Yes! While not something I would recommend, circular dependencies between
services is totally supported.

```ts
class UserService {
  @Inject("PaymentService") public paymentService: PaymentService
}

class PaymentService {
  @Inject("UserService") public userService: UserService
}
```
