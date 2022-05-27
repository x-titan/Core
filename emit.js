import Base from "./base.js"
import Core from "./core.js"
import Utils from "./utils.js"

const EMITTER = Symbol("emitter")

function validEventName(value) {
  const t = typeof value

  if (!(t === "string" || t === "symbol")) {
    throw new TypeError("Invalid event name.")
  }
}

function validFunction(value) {
  if (typeof value !== "function") {
    throw new TypeError("Argument not be a Function.")
  }
}

const _ = {
  hasEventName(ev) {
    if (!this[EMITTER]) {
      this[EMITTER] = new Core()
    }

    return Utils.has.call(this[EMITTER], ev)
  },

  hasEventListener(ev, cb) {
    return (
      this.hasEventName(ev)
      && this[ev].indexOf(cb) !== -1
    )
  },

  addEventListener(ev, cb, opt) {
    validEventName(ev)
    validFunction(cb)

    if (!_.hasEventName.call(this, ev)) {
      this[EMITTER][ev] = []
    }

    const self = this
    const e = self[EMITTER]

    if (e[ev].indexOf(cb) === -1) {
      if (opt && opt.once === true) {
        const fn = cb

        cb = function (...args) {
          fn.apply(this, args)
          _.removeEventListener.call(self, ev, cb)
        }
      }

      e[ev].push(cb)
    }
    return this
  },

  removeEventListener(ev, cb) {
    validEventName(ev)
    validFunction(cb)

    if (_.hasEventName.call(this, ev)) {
      const e = this[EMITTER][ev]
      const i = e.indexOf(cb)

      if (i !== -1) e.splice(i, 1)
    }

    return this
  },

  removeAllEventListeners(ev) {
    validEventName(ev)
    _.hasEventName.call(this, ev)
    this[EMITTER][ev] = []

    return this
  },

  on(ev, cb) {
    return _.addEventListener.call(this, ev, cb)
  },

  once(ev, cb) {
    return _.addEventListener.call(this, ev, cb, { once: true })
  },

  off(ev, cb) {
    return _.removeEventListener.call(this, ev, cb)
  },

  emit(ev, ...args) {
    validEventName(ev)

    if (_.hasEventName.call(this, ev)) {
      Utils.each.call(this[EMITTER][ev], (fn) => {
        fn.apply(this, args)
      })
    }
    return this
  },
}

export default class Emit extends Base {
  [EMITTER] = new Core()

  static mixin(self) {
    if (typeof self === "object" && self !== null) {
      if (!self[EMITTER]) {
        self[EMITTER] = new Core()
      }

      Utils.mixin(self, _)
    }
    return self
  }

  static __EMITTER__ = EMITTER
}

Object.assign(Emit.prototype, _)
