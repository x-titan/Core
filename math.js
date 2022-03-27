const { freeze } = Object
const { iterator } = Symbol
const { PI, E, SQRT2, sqrt } = Math

//#region Constants
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
//#endregion

//#region IsNumber
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
//#endregion

//#region Random
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
 * @param {number} start
 * @param {number} end
 */
export function randInt(start, end) {
  return round(random(start, end))
}
//#endregion

//#region Calc
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
/** @param {number} value */
export function floor(value) {
  validNumber(value)
  return ~~value
}
/** @param {number} value */
export function ceil(value) {
  validNumber(value)
  return value % 1 ?
    ~~(value + 1) : value
}
/** @param {number} value */
export function round(value) {
  validNumber(value)
  return value % 1 < 0.5 ?
    ~~value : ceil(value)
}
/** @param {number} value */
export function toInt(value) {
  validNumber(value)
  return round(value)
}
/** @param {number} value */
export function toDecimal(value) {
  validNumber(value)
  return round(value * 10) / 10
}
//#endregion

//#region UUID
function randChar_(start, end) {
  return String.fromCharCode(randInt(start, end))
}
function randUpperLetter() {
  const UPPER_A = 65
  const UPPER_Z = 90
  return randChar_(UPPER_A, UPPER_Z)
}
function randLowerLetter() {
  const LOWER_A = 97
  const LOWER_Z = 122
  return randChar_(LOWER_A, LOWER_Z)
}
function randDigitChar() {
  const DIGIT_0 = 48
  const DIGIT_9 = 57
  return randChar_(DIGIT_0, DIGIT_9)
}
function randSymbolChar() {
  const all = [
    { start: 42, end: 47 },
    { start: 60, end: 64 },
    { start: 91, end: 95 }]
  const i = all[randInt(0, 2)]
  return randChar_(i.start, i.end)
}
function randLetter() {
  return [
    randSymbolChar,
    randUpperLetter,
    randLowerLetter,
    randDigitChar
  ][randInt(0, 3)]()
}
const uuidList = new Set()
/** @param {number} len */
export function UUID(len) {
  if (len <= 0)
    throw new Error("Len not be equal a positive value")
  const _len = len
  let id = ""
  while (len--) id += randLetter()
  if (uuidList.has(id)) return UUID(_len)
  uuidList.add(id)
  return id
}
//#endregion

//#region Range
function baseRange(start, stop, step) {
  const self = {
    [iterator]() {
      const len = stop
      let i = start - step
      const iterable = {
        next() {
          const done = iterable.isDone
          return { done, value: done ? null : i += step }
        },
        get isDone() {
          const _i = i + step
          return !((step > 0) ?
            _i < len : _i > len)
        },
        get self() { return _range }
      }
      freeze(iterable)
      return iterable
    },
    start,
    stop,
    step
  }
  return freeze(self)
}
/** 
 * @param {number} [start] 
 * @param {number} [stop] 
 * @param {number} [step] 
 */
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
//#endregion