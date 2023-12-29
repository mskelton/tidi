type Service = new (...args: any) => any

/** IOC container. */
export declare class Container {
  /** Bind one or more classes in the IOC container. */
  bind(...services: Service[]): void
  /** Get a service from the IOC container. */
  get<T>(name: string): T
}

/** Inject a dependency with the given service name to the class property. */
export declare const inject: (
  name: string,
) => (target: any, key: string | undefined, index?: number) => any

/**
 * Marks a class as injectable. Without this decorator, the dependencies will
 * not be resolved.
 */
export declare const injectable: (name: string) => (target: any) => any
