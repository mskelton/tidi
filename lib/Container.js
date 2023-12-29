import { NAME } from "./symbols.js"

export class Container {
  #bound = {}
  #services = {}

  /** Bind one or more classes in the IOC container. */
  bind(...services) {
    for (const service of services) {
      this.#bound[service[NAME]] = service
    }
  }

  /** Get a service from the IOC container. */
  get(name) {
    return this.#services[name] ?? this.#resolve(name)
  }

  #resolve(name) {
    const constructor = this.#bound[name]
    if (!constructor) {
      throw new Error(`Service ${name} not found`)
    }

    return (this.#services[name] = new constructor(this))
  }
}
