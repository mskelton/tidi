import type { Container } from "./Container.js"
import { INJECTED } from "./symbols.js"

/**
 * Marks a class as injectable. Without this decorator, the dependencies will
 * not be resolved.
 */
export function Injectable(target: any): new () => any {
  const result = class extends target {
    constructor(container: Container) {
      super()

      // We have to do some type casting here. We know that the target will
      // have an INJECTED property assuming it has at least one dependency.
      const map = (this as any)[INJECTED] as Record<string, string> | undefined

      // Bail if there are no injected dependencies
      if (!map) return

      for (const [key, name] of Object.entries(map)) {
        // We have to use a getter to support circular dependencies, otherwise
        // we would get maximum call stack errors.
        Object.defineProperty(this, key, {
          get() {
            return container.get(name)
          },
        })
      }
    }
  }

  return result as new () => any
}
