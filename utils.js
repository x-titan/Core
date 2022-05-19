import Base from "./base.js"
import Core from "./core.js"

const { iterator } = Symbol
const {
  freeze,
  assign,
  hasOwnProperty: hasOwn,
  getOwnPropertyDescriptor: getDesc,
} = Object
const {
  defineProperty: define,
  toString
} = Reflect

const _ = {
  /** @param {(value, index: number, array: this) => void} fn */
  each(fn, stoppable = false) {
    let i = 0

    if (typeof this[iterator] === "function") {
      for (const item of this) {
        if (
          fn(item, i++, this) === true
          && stoppable === true
        ) break
      }
    } else {
      i = this.length
      
      while (i--) {
        if (
          fn(this[i], i, this) === true
          && stoppable === true
        ) break
      }
    }
    return this
  },

  mixin(...sources) {
    const self = sources[0]
    const t = typeof self

    if (!(t === "object" || t === "function")) return void 0

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
  },

  toString() {
    if (this === undefined) return "[undefined]"
    if (this === null) return "[null]"

    const type = _.type(this)
    let name

    if (type === "number" || type === "string") {
      name = "" + this
    } else if (type === "array") {
      name = this.toString()
    } else {
      name = toString.call(this).slice(8, -1)
    }
    return "[" + type + " " + name + "]"
  },

  type(target) {
    if (target === null) return "null"
    if (target instanceof Base) return "base"
    if (target instanceof Core) return "core"
    if (Array.isArray(target)) return "array"

    return typeof target
  },

  /**
   * @param {unknown} a
   * @param {unknown} b
   * @return {a is b}
   */
  equals(a, b) {
    if (a === b) {
      return (a !== 0) || ((1 / a) === (1 / b))
    }
    else {
      return (a !== a) && (b !== b)
    }
  },

  /** @param {new *} cons */
  instance(target, cons) {
    if (cons === undefined || cons === null) {
      return target?.constructor?.name || null
    }
    return target instanceof cons
  },

  extend(obj) {
    if (this === undefined || this === null) return void 0

    const t = typeof obj
    if (!(t === "object" || t === "function")) {
      throw new Error("Required a object")
    }
    for (const key in obj) {
      if (hasOwn.call(obj, key)) {
        define(this, key, getDesc(obj, key))
      }
    }
    return this
  },

  forIn(obj, fn, stoppable) {
    for (const k in obj) {
      if (
        hasOwn.call(obj, k)
        && fn(obj[k], k, obj) === false
        && stoppable === true
      ) break
    }
    return obj
  },

  forOf(obj, fn, stoppable) {
    if (typeof obj[iterator] === "function") {
      for (const item of obj) {
        if (
          fn(item, obj) === false
          && stoppable === true
        ) break
      }
    }
    return obj
  },

  map(fn) {
    if (_.type(this) !== "array") return void 0

    _.each.call(this, (item, i) => (
      this[i] = fn(item, i, this)
    ))

    return this
  },

  filter(fn) {
    if (_.type(this) !== "array") return void 0

    _.each.call(this, (item, i) => {
      if (fn(item, i, this) === false)
        this.splice(i, 1)
    })

    return this
  },

  default(target, def) { return _.mixin(def, target) },
  define,
  hasOwnProperty: hasOwn,
  has: hasOwn
}

const Utils = freeze(assign(
  new class Utils extends Base { }, _
))

export default Utils