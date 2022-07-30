import {
  is,
  each,
  extend,
  validateType,
  makeValidator,
  Null,
} from "https://x-titan.github.io/utils/index.js"
import Base from "./base.js"

const EMITTER = Symbol("Emitter")
const {
  hasOwnProperty: hasOwn
} = Reflect

const validEventName = makeValidator(
  (value) => (is.str(value) || is.symbol(value)),
  () => (new TypeError("Invalid event name."))
)

function initEmitter(self, eventName) {
  if (is.empty(self)) return
  if (!self[EMITTER]) {
    self[EMITTER] = new Null()
  }
  if (eventName) {
    validEventName(eventName)
    self[EMITTER][eventName] = []
  }

  return self[EMITTER]
}

function getEvent(self, eventName) {
  return initEmitter(self, eventName)[eventName]
}

const _ = {
  hasEventName(eventName) {
    return hasOwn.call(initEmitter(this), eventName)
  },

  hasEventListener(eventName, callback) {
    return getEvent(this, eventName).indexOf(callback) !== -1
  },

  addEventListener(eventName, callback, options) {
    validateType(is.func, callback)
    const self = this
    const event = getEvent(self, eventName)

    if (event.indexOf(callback) !== -1) return false
    if (options && options.once === true) {
      const exec = callback
      callback = function (...args) {
        exec.apply(self, args)
        _.removeEventListener.call(self, eventName, callback)
      }
    }

    event.push(callback)

    return true
  },

  removeEventListener(eventName, callback) {
    validateType(is.func, callback)
    const event = getEvent(this, eventName)

    if (_.hasEventListener.call(this, eventName)) {
      event.splice(event.indexOf(callback), 1)

      return true
    }

    return false
  },

  removeAllEventListeners(eventName) {
    const emitter = initEmitter(this)
    validEventName(eventName)
    emitter[eventName] = []
    return true
  },

  on(eventName, callback) {
    return _.addEventListener.call(this, eventName, callback)
  },

  once(eventName, callback) {
    return _.addEventListener.call(
      this,
      eventName,
      callback,
      { once: true }
    )
  },

  emit(eventName, ...args) {
    return each(getEvent(this, eventName), (fn) => {
      fn.apply(this, args)
    })
  },
}

export default class Emit extends Base {
  [EMITTER] = {}

  static mixin(obj) {
    if (is.obj(obj)) {
      initEmitter(obj)

      extend(obj, _)
    }
  }
}
