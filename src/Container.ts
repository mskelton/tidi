export type Service = new () => any

export const CONTAINER_SYM = Symbol("Container")

export class Container {
  #bound = new Map<string, Service>()
  #services = new Map<string, any>()

  /** Bind a class in the IOC container. */
  bind(name: string, service: Service) {
    this.#bound.set(name, service)
  }

  /** Get a service from the IOC container. */
  get<T>(name: string): T {
    return this.#services.has(name)
      ? (this.#services.get(name) as T)
      : this.#resolve<T>(name)
  }

  #resolve<T>(name: string) {
    const constructor = this.#bound.get(name)
    if (!constructor) {
      throw new Error(`Service ${name} not found`)
    }

    const service = new constructor()
    service[CONTAINER_SYM] = this

    this.#services.set(name, service)
    return service as T
  }
}
