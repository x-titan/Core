import Core from "./core.js"
import Base from "./base.js"
import Utils from "./utils.js"
import Mono from "./mono.js"

globalThis.u = Utils

export { Core, Base, Utils, Mono }


/** @returns {value is number} */
export function isNumber(value) {
  return typeof value === "number" || value instanceof Number
}
/** @param {number} [seed] */
export function randomSeed(seed) {
  const _random = isNumber(seed) ? () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  } : Math.random
  /**
   * @param {number} min
   * @param {number} max
   */
  return function (min, max) {
    min = isNumber(min) ? min : 0
    max = isNumber(max) ? max : 1
    return min + _random() * (max - min)
  }
}
export const random = randomSeed()
/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function constraints(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}
/**
 * @param {number} value
 */
export function sign(value) {
  if (value === 0) return 0
  return value > 0 ? 1 : -1
}
const { freeze } = Object
const { PI, E, SQRT2, sqrt } = Math
export const CONST = freeze({
  /** @type {3.1415926535897932} */
  PI: PI,
  /** @type {6.2831853071795865} */
  PI2: PI * 2,
  /** @type {6.2831853071795865} */
  TAU: PI * 2,
  /** @type {2.7182818284590451} */
  E,
  /** @type {1.6180339887498948} */
  PHI: (1 + sqrt(5)) / 2,
  /** @type {1.4142135623730951} */
  SQRT2
})
export function floor(value) { return ~~value }
export function ceil(value) { return value % 1 ? ~~(value + 1) : value }
export function round(value) {
  return value % 1 >= 0.5 ? ceil(value) : ~~value
}
export function toInt(value) { return round(value) }
export function toDecimal(value) { return round(value * 10) / 10 }