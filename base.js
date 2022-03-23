import Core from "./core.js"

const { toStringTag } = Symbol

export default class Base extends Core {
  clone(...args) { return new this.constructor(...args) }
  toString() { return "[base " + (this[toStringTag] || "Base") + "]" }
  [toStringTag] = this.constructor.name || "Base"
  static toString() { return this.name || "Base" }
}