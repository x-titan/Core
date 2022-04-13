import Base from "./base.js"
import Core from "./core.js"

const { iterator } = Symbol
const {
  freeze,
  assign,
  hasOwnProperty: hasown,
  getOwnPropertyDescriptor: getown
} = Object
const { defineProperty, toString } = Reflect
const _ = {
  /**
   * @param {(value, index: number, array: this) => void} fn
   */
  each(fn, stoppable) {
    let i = this.length
    while (i--)
      if (fn(this[i], i, this) ===
        true && stoppable === true) break
    return this
  },
  define: defineProperty,
  mixin(...sources) {
    const self = sources[0]
    const t = typeof self
    if (!(t === "object" || t === "function"))
      return void 0
    for (const source of sources)
      if (typeof source === "object")
        for (const key in source)
          if (hasown.call(source, key))
            self[key] = source[key]
    return self
  },
  default(target, def) { return _.mixin(def, target) },
  toString() {
    if (this === undefined) return "[undefined]"
    if (this === null) return "[null]"
    const type = _.type(this)
    let name = "Object"
    if (type === "number" || type === "string")
      name = "" + this
    else if (type === "array")
      name = this.toString()
    else name = toString.call(this).slice(8, -1)
    return "[" + type + " " + name + "]"
  },
  type(target) {
    if (target === null) return "null"
    if (target instanceof Base) return "base"
    if (target instanceof Core) return "core"
    if (Array.isArray(target)) return "array"
    return typeof target
  },
  equals(a, b) {
    if (a === b)
      return a !== 0 || 1 / a === 1 / b
    else
      return a !== a && b !== b
  },
  /**
   * @param {new *} constructor
   */
  instance(target, constructor) {
    if (constructor === undefined || constructor === null)
      return target?.constructor?.name || null
    return target instanceof constructor
  },
  extend(obj) {
    if (this === undefined || this === null) return void 0
    const t = typeof obj
    if (!(t === "object" || t === "function"))
      throw new Error("Required a object")
    for (const key in obj)
      if (hasown.call(obj, key))
        defineProperty(this, key, getown(obj, key))
    return this
  },
  forIn(obj, fn, stoppable) {
    for (const k in obj)
      if (hasown.call(obj, k) &&
        fn(obj[k], k, obj) === false &&
        stoppable === true) break
    return obj
  },
  forOf(obj, fn, stoppable) {
    if (typeof obj[iterator] === "function")
      for (const item of obj)
        if (fn(item, obj) === false &&
          stoppable === true) break
    return obj
  },
  map(fn) {
    if (_.type(this) !== "array") return void 0
    _.each.call(this, (item, i) => {
      this[i] = fn(item, i, this)
    }, false)
    return this
  },
  filter(fn) {
    if (_.type(this) !== "array") return void 0
    _.each.call(this, (item, i) => {
      if (fn(item, i, this) === false)
        this.splice(i, 1)
    }, false)
    return this
  },
  hasOwnProperty: hasown,
  has: hasown
}
const Utils = freeze(assign(new class Utils extends Base { }, _))
export default Utils