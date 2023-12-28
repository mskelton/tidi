import { PARAMETERS, PROPERTIES } from "./symbols.js"

/** Inject a dependency with the given service name to the class property. */
export function Inject(name: string) {
  return function (target: any, key: string | undefined, index?: number): any {
    // Parameter decorator
    if (index != null) {
      target[PARAMETERS] ??= []
      target[PARAMETERS][index] = name
    } else {
      // Sadly due to the current nature of decorators, we have to store a map of
      // dependencies to inject on the target class. This will improve when
      // JavaScript decorators are standardized.
      //
      // Also good to note that for some reason using a Map here causes issues, so
      // a plain object is used instead.
      target[PROPERTIES] ??= {}
      target[PROPERTIES][key!] = name
    }
  }
}
