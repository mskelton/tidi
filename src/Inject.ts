import { CONTAINER_SYM } from "./Container.js"

export function Inject(name: string) {
  return function (target: any, key: string): any {
    Reflect.defineProperty(target, key, {
      get() {
        // The container is stored in the prototype chain of the class. This is
        // done when resolving services in the container.
        return this[CONTAINER_SYM].get(name)
      },
    })
  }
}
