import type { Container } from "./Container.js"
import { PARAMETERS, PROPERTIES } from "./symbols.js"

/**
 * Marks a class as injectable. Without this decorator, the dependencies will
 * not be resolved.
 */
export function Injectable(target: any): any {
  return class extends target {
    constructor(container: Container) {
      const params = (target as any)[PARAMETERS] as string[] | undefined
      const args = (params ?? []).map((name) => container.get(name))

      super(...args)

      // We have to do some type casting here. We know that the target will
      // have an INJECTED property assuming it has at least one dependency.
      const props = (this as any)[PROPERTIES] as
        | Record<string, string>
        | undefined

      for (const [key, name] of Object.entries(props ?? {})) {
        this[key] = container.get(name)
      }
    }
  }
}