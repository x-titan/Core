import { is, extend } from "https://x-titan.github.io/utils/index.js"
import Core from "./core.js"

const { toStringTag } = Symbol

export default class Base extends Core {
  [toStringTag] = this.constructor.name || "Base"

  extend(obj) { return extend.pro(this, obj) }

  mixin(...sources) { return extend(this, ...sources) }

  toString() { return `[base ${this[toStringTag]}]` }

  is(value) {
    if (value === null || value === undefined) {
      return false
    }
    const t = is(value)
    if (t === "string") {
      return this.constructor.name === value
    }
    if (t === "function") {
      return this instanceof value
    }
    if (t === "object") {
      return this === value
    }
    return false
  }

  static isBase(value) { return value instanceof Base }

  static toString() { return `class ${this.name} { [base code] }` }
}