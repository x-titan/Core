/** @return {value is number} */
export function isNumber(value) {
  return isFinite(value)
}
/** @return {value is number} */
isNumber._ = function (value) {
  const t = typeof value === "number"
  const nan = !(value !== value)
  const inf = !(value === Infinity || value === -Infinity)
  return t && nan && inf
}
/**
 * @param {any} value
 * @return {value is number}
 * @throws {TypeError}
 */
export function validNumber(value) {
  if (!isNumber(value))
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
  return function (min = 0, max = 1) {
    if (!isNumber(min)) min = 0
    if (!isNumber(max)) {
      if (min < 1) {
        max = 1
      } else {
        max = min
        min = 0
      }
    }
    if (min > max) {
      const temp = max
      max = min
      min = temp
    }
    return min + _random() * (max - min)
  }
}
export const random = randomSeed()
/**
 * @param {number} inmin
 * @param {number} inmax
 * @param {number} outmin
 * @param {number} outmax
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
export function randInt(start = 0, end = 1) {
  return round(random(start, end))
}
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
  return value % 1 < 0.5 ?
    ~~value : ceil(value)
}
export function toInt(value) {
  validNumber(value)
  return round(value)
}
export function toDecimal(value) {
  validNumber(value)
  return round(value * 10) / 10
}

function randChar_(start, end) {
  return String.fromCharCode(randInt(start, end))
}

function randUpperLetter() {
  const UPPERCASE_A = 65
  const UPPER_END_Z = 90
  return randChar_(UPPERCASE_A, UPPER_END_Z)
}
function randLowerLetter() {
  const LOWERCASE_A = 97
  const LOWER_END_Z = 122
  return randChar_(LOWERCASE_A, LOWER_END_Z)
}
function randDigitChar() {
  const DIGIT_0 = 48
  const DIGIT_9 = 57
  return randChar_(DIGIT_0, DIGIT_9)
}
function randLetter() {
  return random(-1, 1) > 0 ? randUpperLetter() : randLowerLetter()
}
function _Range(start, stop, step) {
  if (!(this instanceof _Range))
    return new _Range(start, stop, step)
  this.start = start
  this.stop = stop
  this.step = step
  this[Symbol.iterator] = ()=>{
    const len = stop
      let i = start - step
      const _iterator = {
        next() {
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
  }
}
function baseRange(start, stop, step) {

  const _range = {
    [Symbol.iterator]() {
      const len = stop
      let i = start - step
      const _iterator = {
        next() {
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
  if (step === 0) throw new Error("Step not a zero value")
  if (!isNumber(start)) start = 0
  if (!isNumber(stop)) {
    stop = start || 1
    start = 0
  }
  if (!isNumber(step))
    step = (start > stop) ? -1 : 1
  if ((start > stop && step > 0) ||
    (start < stop && step < 0))
    throw new Error("Reverse step error")
  return baseRange(start, stop, step)
}
console.log(range().constructor) 