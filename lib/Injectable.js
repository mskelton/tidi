import { NAME, PARAMETERS, PROPERTIES } from "./symbols.js"

/**
 * Marks a class as injectable. Without this decorator, the dependencies will
 * not be resolved.
 */
export function injectable(name) {
  return (target) => {
    // Add the name to the class prototype so we can access it later when
    // binding services.
    target[NAME] = name

    return class extends target {
      constructor(container) {
        const args = (target[PARAMETERS] ?? []).map((name) =>
          container.get(name),
        )

        super(...args)

        for (const [key, name] of Object.entries(this[PROPERTIES] ?? {})) {
          this[key] = container.get(name)
        }
      }
    }
  }
}
