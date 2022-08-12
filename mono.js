import {
  is,
  validateType,
} from "https://x-titan.github.io/utils/index.js"
import Base from "./base.js"

const hasOnListRev = (value) => (!ctorList.has(value))

const makeError = (name) => {
  throw new Error(
    "Objects of the Mono class must be in only one instance. "
    + "This class " + name + " has already been used"
  )
}

/**
 * Сhecks whether this item is in the list and returns the result.
 * After checking, it is added to the list.
 *
 * If the item is in the list returns `false`. So it's okay.
 *
 * Else `true`. This means that the item is present in the list.
 */
class Mono extends Base {
  /** @param {() => throw} onerror Calling on error */
  constructor(onerror) {
    const target = new.target

    if (!is.func(onerror)) onerror = makeError

    validateType(hasOnListRev, target, onerror)
    ctorList.add(target)
    super()
  }

  /** @param {new unknown} target */
  static has(target) { return ctorList.has(target) }

  /**
   * Сhecks whether this item is in the list and returns the result.
   * After checking, it is added to the list.
   *
   * If the item is in the list returns `false`. So it's okay.
   *
   * Else `true`. This means that the item is present in the list.
   * @param {Object} target `this`
   * @param {*} [target.]
   * @param {() => throw} onerror Calling on error
   */
  static mixin(target, onerror) {
    validateType(is.obj, target)

    const cons = target.constructor

    if (!is.func(onerror)) onerror = makeError
    if (ctorList.has(cons)) { return onerror() }

    ctorList.add(cons)

    return target
  }

  /**
   * @param {new unknown} target
   * @param {() => throw} onerror
   * @return {target}
   */
  static mono(target, onerror) {
    validateType(is.defined, target)
    validateType.any(is.func, target, target?.constructor)

    const _ = function (...args) {
      return Mono.mixin(new target(...args), onerror)
    }

    try {
      if (!target.prototype) {
        Object.setPrototypeOf(target, target.prototype = {})
      }

      target.constructor = target.prototype.constructor = _
      Object.setPrototypeOf(_, _.prototype = target.prototype || {})
    } catch (e) {
      console.warn(
        "Mono error. class "
        + target.name
        + " not be a mixin to Mono"
      )
      console.trace(e)
    }
    return _.constructor = _.prototype.constructor = _
  }
}

const ctorList = new Set([Mono])

export default Mono
