import Core from "./core.js"

const { toStringTag } = Symbol
const {
  hasOwnProperty: hasOwn,
  getOwnPropertyDescriptor: getDesc,
} = Object

export default class Base extends Core {
  [toStringTag] = this.constructor.name || "Base"

  toString() {
    return "[base " + (this[toStringTag] || "Base") + "]"
  }

  extend(obj) {
    const t = typeof obj
    if (!(t === "object" || t === "function")) {
      throw new Error("Required a object")
    }
    for (const key in obj) {
      if (hasOwn.call(obj, key)) {
        defineProperty(this, key, getDesc(obj, key))
      }
    }
    return this
  }

  /** @param {new unknown | string} value */
  is(value) {
    if (value === null || value === undefined) {
      return false
    }
    if (typeof value === "string") {
      return this.constructor.name === value
    }
    if (typeof value === "function") {
      return this instanceof value
    }
    return false
  }

  mixin(...sources) {
    const self = this
    const t = typeof self

    if (!(t === "object" || t === "function")) {
      throw new TypeError("Invalid arguments. Reqguired a object")
    }
    for (const source of sources) {
      if (typeof source === "object") {
        for (const key in source) {
          if (hasOwn.call(source, key)) {
            self[key] = source[key]
          }
        }
      }
    }
    return self
  }

  static toString() {
    return `class ${this.name || "Base"} { [native code] }`
  }
}