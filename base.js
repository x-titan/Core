import Core from "./core.js"

const { toStringTag } = Symbol
const {
  hasOwnProperty: hasown,
  getOwnPropertyDescriptor: getown
} = Object

export default class Base extends Core {
  [toStringTag] = this.constructor.name || "Base"
  toString() {
    return "[base " + (this[toStringTag] || "Base") + "]"
  }
  extend(obj) {
    const t = typeof obj
    if (!(t === "object" || t === "function"))
      throw new Error("Required a object")
    for (const key in obj)
      if (hasown.call(obj, key))
        defineProperty(this, key, getown(obj, key))
    return this
  }
  mixin(...sources) {
    const self = this
    const t = typeof self
    if (!(t === "object" || t === "function"))
      return void 0
    for (const source of sources)
      if (typeof source === "object")
        for (const key in source)
          if (hasown.call(source, key))
            self[key] = source[key]
    return self
  }
  static toString() {
    return "class " +
      (this.name || "Base") +
      " { [core code] }"
  }
}