import { is, extend } from "https://x-titan.github.io/utils/index.js"
import Core from "./core.js"

const { toStringTag } = Symbol

export default class Base extends Core {
  constructor() {
    super()
    this[toStringTag] = (this.constructor.name || "Base")
  }

  extend(obj) { return extend.pro(this, obj) }

  mixin(...sources) { return extend(this, ...sources) }

  toString() { return `[base ${this[toStringTag]}]` }

  instanceof(value) {
    if (value === null || value === undefined) { return false }

    const t = is(value)

    if (t === "string") { return this.constructor.name === value }
    if (t === "function") { return this instanceof value }
    if (t === "object") { return this === value }

    return false
  }

  static type(value) {
    if (value === null) return "null"
    if (value instanceof Base) return "base"
    if (value instanceof Core) return "core"
    if (Array.isArray(value)) return "array"
  }

  static isBase(value) { return value instanceof Base }

  static toString() { return `class ${this.name || "Base"} { [base code] }` }
}