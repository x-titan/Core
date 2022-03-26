/** @returns {value is number} */
export function isNumber(value) {
  return isFinite(value)
}
/**
 * @param {any} value
 * @return {value is number}
 * @throws {TypeError}
 */
export function validNumber(value) {
  if (!isFinite(value))
    throw new TypeError("Type error. Required a number")
}
validNumber.all = function (...values) {
  let i = values.length
  while (i--)
    validNumber(values[i])
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
/**
 * @param {number} inmin
 * @param {number} inmax
 * @param {number} outmin
 * @param {number} outmax
 * @returns 
 */
export function normalizer(inmin, inmax, outmin, outmax) {
  validNumber.all(inmin, inmax, outmin, outmax)
  if (inmin > inmax || outmin > outmax)
    throw new Error("Minmax error")
  return (value = inmin) => {
    if (!isNumber(value)) value = inmin
    if (value < inmin) value = inmin
    if (value > inmax) value = inmax
    return outmin + ((outmax - outmin) * (value - inmin) / inmax)
  }
}
export const random = randomSeed()
/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function constraints(value, min, max) {
  validNumber.all(value, min, max)
  if (value < min) return min
  if (value > max) return max
  return value
}
/** @param {number} value */
export function sign(value) {
  validNumber(value)
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
export function floor(value) {
  validNumber(value)
  return ~~value
}
export function ceil(value) {
  validNumber(value)
  return value % 1 ?
    ~~(value + 1) : value
}
export function round(value) {
  validNumber(value)
  return value % 1 >= 0.5 ?
    ceil(value) : ~~value
}
export function toInt(value) {
  validNumber(value)
  return round(value)
}
export function toDecimal(value) {
  validNumber(value)
  return round(value * 10) / 10
}

function baseRange(start, stop, step) {
  const _range = {
    [Symbol.iterator]: () => {
      const len = stop
      let i = start - step
      const _iterator = {
        next: () => {
          const done = _iterator.isDone
          return { done, value: done ? null : i += step }
        },
        get isDone() {
          const _i = i + step
          return !((step > 0) ?
            _i < len : _i > len)
        },
        get self() { return _range }
      }
      return _iterator
    },
    get start() { return start },
    get stop() { return stop },
    get step() { return step }
  }
  return _range
}

export function range(start, stop, step) {
  validNumber(start)
  if (step === 0) throw new Error("Step not a zero value")
  if (!isNumber(stop)) {
    stop = start
    start = 0
  }
  if (!isNumber(step))
    step = (start > stop) ? -1 : 1
  if ((start > stop && step > 0) ||
    (start < stop && step < 0))
    throw new Error("Reverse step error")
  return baseRange(start, stop, step)
}