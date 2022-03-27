import Base from "./base.js"

export default class Mono extends Base {
  constructor() {
    const target = new.target
    if (constructorList.has(target))
      throw new Error("This class " + target.name +
        " has already been used")
    constructorList.add(target)
    super()
  }
  /** @param {new unknown} target */
  static has(target) { return constructorList.has(target) }
  static mixin(target) {
    if (typeof target !== "object")
      throw new Error("Bad argument. Required object")
    const cons = target.constructor
    if (this.has(cons))
      throw new Error("This class " + cons.name +
        " has already been used")
    constructorList.add(cons)
    return target
  }
  /**
   * @param {new unknown} target
   * @return {target}
   */
  static mono(target) {
    if (typeof target !== "function" ||
      typeof target.constructor !== "function")
      throw new Error("Bad argument. Required class or function")
    const _ = function (...args) {
      return Mono.mixin(new target(...args))
    }
    try {
      if (!target.prototype)
        Object.setPrototypeOf(target.prototype = {})
      target.constructor = target.prototype.constructor = _
      _.prototype = target.prototype || {}
    } catch (e) {
      console.warn("Mono error. class " +
        target.name + " not be a mixin to Mono")
      console.trace(e)
    }
    return _.constructor = _.prototype.constructor = _
  }
}
function a() { }
const b = () => { console.log(this) }
console.log(a.prototype, a.constructor)
console.log(b.prototype, b.constructor)


const constructorList = new Set([Mono])