import Base from "./base.js";

export default class Mono extends Base {
  constructor() {
    const target = new.target
    if (constructorList.has(target))
      throw new Error("This class " + target.name +
        " has already been used")
    constructorList.add(target)
    return target
  }
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
  static mono(target) {
    if (typeof target !== "function" ||
      typeof target.constructor !== "function")
      throw new Error("Bad argument. Required class or function")
    const _ = function () { return Mono.mixin(new target(arguments)) }
    return _.constructor = _.prototype.constructor = _
  }
}