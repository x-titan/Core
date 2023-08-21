import {
  is,
  each,
  validate,
} from "https://x-titan.github.io/utils/index.js"
import Base from "./base.js"

const EMIT = Symbol("Emit")

function isEventName(value) {
  const t = typeof value
  return t === "string" || t === "symbol"
}

function initEmit(target, cfg) {
  validate(is.obj, target)

  if (!is.obj(target[EMIT])) {
    target[EMIT] = {}
  }

  if (is.obj(cfg)) {
    each(cfg.eventList, (name) => {
      if (isEventName(name)) { target[EMIT][name] = [] }
    })
    if (is.bool(cfg.configurable)) {
      // PASS
    }
  }

  return target[EMIT]
}

function getEvent(target, name) {
  const e = initEmit(target)
  validate(isEventName, name)
  if (!e[name]) { e[name] = [] }
  return e[name]
}

function detachEvent(target, eventName, callback) {
  validate(is.func, callback)

  const e = getEvent(target, eventName)
  const i = e.indexOf(callback)

  if (i !== -1) {
    e.splice(i, 1)
    return true
  }

  return false
}

function attachEvent(target, eventName, callback, config) {
  const e = getEvent(target, eventName)
  validate(is.func, callback)
  e.push(callback)

  if (is.obj(config)) {
    if (typeof config.once === "boolean") {
      callback.once = config.once
    }
    if (config.thisArg) {
      callback.thisArg = config.thisArg
    }
  }

  return true
}

function executeEvent(target, eventName, config) {
  const e = getEvent(target, eventName)
  let args = []

  if (is.obj(config)) {
    if (is.array(config.args)) args = config.args
  }

  each.reverse(e, (fn, i) => {
    fn.apply(fn.thisArg, args)
    if (fn.once) {
      e.splice(i, 0)
    }
  })
}

export default class Emit extends Base {
  addEventListener(eventName, callback, config) {
    return attachEvent(this, eventName, callback, config)
  }
  on(eventName, callback) {
    return attachEvent(this, eventName, callback, { once: false })
  }
  once(eventName, callback) {
    return attachEvent(this, eventName, callback, { once: true })
  }
  removeEventListener(eventName, callback) {
    return detachEvent(this, eventName, callback)
  }
  removeAllEventListener(eventName) {
    return initEmit(this, { eventList: [eventName] })
  }
  off(eventName, callback) {
    return detachEvent(this, eventName, callback)
  }
  emit(eventName, config) {
    return executeEvent(this, eventName, config)
  }
}
