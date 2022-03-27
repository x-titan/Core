const NAMESPACE = Symbol("namespace")
const NAME = Symbol("name")

const isString = value => typeof value === "string"
const validString = value => {
  if (!isString(value))
    throw new TypeError("Type error. Required a string")
}
const validFunc = value => {
  if (typeof value !== "function")
    throw new Error("Type error. Required a function")
}
export default class NameSpace {
  /** @type {Set<string>} */
  constructor(name) {
    validString(name)
    if (NameSpace.has(name))
      throw new Error("NameSpace has been used")

    NameSpace[NAMESPACE][name] = this
    this[NAME] = name
    Object.defineProperty(this, "space", {
      writable: false,
      configurable: false,
      value: this.space.bind(this)
    })
  }
  /**
   * @param {(g: NameSpace) => void} fn
   * @return {NameSpace}
   */
  space(fn) {
    validFunc(fn)
    fn(this)
    return this
  }
  static [NAMESPACE] = {}
  static get namelist() {
    return Object.keys(this[NAMESPACE])
  }
  static has(name) {
    validString(name)
    return this[NAMESPACE][name] instanceof NameSpace
  }
  /**
   * @param {string} name
   * @returns {NameSpace}
   */
  static get(name) {
    validString(name)
    if (this.has(name)) return this[NAMESPACE][name]
    else throw new Error("NameSpace not found")
  }
  /**
   * @param {string} name
   * @param {(g: NameSpace) => void} [fn]
   * @returns {NameSpace}
   */
  static create(name, fn) {
    validString(name)
    const ns = this[NAMESPACE][name] = new NameSpace(name)
    if (typeof fn === "function")
      ns.space(fn)
    return ns
  }
  /**
   * @param {string} name
   * @param {(g: NameSpace) => void} [fn]
   * @returns {NameSpace}
   */
  static ns(name, fn) {
    validString(name)
    const ns = (this.has(name)) ? this.get(name) :
      this[NAMESPACE][name] = new NameSpace(name)
    if (typeof fn === "function")
      ns.space(ns)
  }
  static getNameFromSpace(ns) {
    return ns instanceof NameSpace ?
      ns[NAME] : null
  }
}