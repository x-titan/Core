import Base from "./base.js"
import Core from "./core.js"
import Utils from "./utils.js"

const EMITTER = Symbol("emitter")
function validEventName(value) {
  const t = typeof value
  if (!(t === "string" || t === "symbol") ||
    (value === "" || /^[0-9]/gm.test(value)))
    throw new TypeError("Invalid event name.")
}
function validFunction(value) {
  if (typeof value !== "function")
    throw new TypeError("Argument not be a Function.")
}

const _ = {
  hasEventName(ev) {
    if (!this[EMITTER]) this[EMITTER] = new Core()
    return Utils.has.call(this[EMITTER], ev)
  },
  hasListener(ev, cb) {
    return this.hasEventName(ev) &&
      this[ev].indexOf(cb) !== -1
  },
  on(ev, cb) {
    validEventName(ev)
    validFunction(cb)
    const e = this[EMITTER]
    if (!_.hasEventName.call(this, ev))
      e[ev] = []
    if (e[ev].indexOf(cb) === -1)
      e[ev].push(cb)
    return this
  },
  once(ev, cb) {
    validEventName(ev)
    validFunction(cb)
    const self = this
    const e = self[EMITTER]
    if (!_.hasEventName.call(self, ev))
      e[ev] = []

    e[ev].push(function (...args) {
      cb.apply(this, args)
      _.removeListenter.call(self, ev, cb)
    })
    return this
  },
  addListener(ev, cb, opt) {
    validEventName(ev)
    validFunction(cb)
    const e = this[EMITTER]
    if (!_.hasEventName.call(this, ev))
      e[ev] = []
    let fn = _.on
    if (opt && opt.once === true)
      fn = _.once
    fn.call(this, ev, cb)
    return this
  },
  removeListenter(ev, cb) {
    validEventName(ev)
    validFunction(cb)
    if (_.hasEventName.call(this, ev)) {
      const e = this[EMITTER][ev]
      const i = e.indexOf(cb)
      if (i !== -1) e.slice(i, 1)
    }
    return this
  },
  removeAllListener(ev) {
    validEventName(ev)
    this[EMITTER][ev] = []
    return this
  },
  emit(ev, ...args) {
    validEventName(ev)
    if (_.hasEventName.call(this, ev))
      Utils.each.call(this[EMITTER][ev], (fn) => {
        fn.apply(undefined, args)
      })
    return this
  }
}
export default class Emit extends Base {
  [EMITTER] = new Core()
  /**
   * @param {string|Symbol} eventName
   */
  hasEventName(eventName) {
    return _.hasEventName.call(this, eventName)
  }
  /**
   * @param {string|Symbol} eventName
   * @param {(...args)=>void} callback
   */
  hasListener(eventName, callback) {
    return _.hasListener.call(this, eventName, callback)
  }
  /**
   * @param {string|Symbol} eventName
   * @param {(...args)=>void} callback
   */
  on(eventName, callback) {
    _.on.call(this, eventName, callback)
    return this
  }
  /**
   * @param {string|Symbol} eventName
   * @param {(...args)=>void} callback
   */
  once(eventName, callback) {
    _.once.call(this, eventName, callback)
    return this
  }
  /**
   * @param {string|Symbol} eventName
   * @param {(...args)=>void} callback
   * @param {{once:?boolean}} [options]
   */
  addListener(eventName, callback, options) {
    _.addListener.call(this, eventName, callback, options)
    return this
  }
  /**
   * @param {string|Symbol} eventName
   * @param {(...args)=>void} callback
   */
  removeListenter(eventName, callback) {
    _.removeListenter.call(this, eventName, callback)
    return this
  }
  /**
   * @param {string|Symbol} eventName
   */
  removeAllListener(eventName) {
    _.removeAllListener.call(this, eventName)
    return this
  }
  /**
   * @param {string|Symbol} eventName
   */
  emit(eventName, ...args) {
    _.emit.call(this, eventName, ...args)
    return this
  }
  static mixin(self) {
    if (typeof self === "object" && self !== null) {
      if (!self[EMITTER]) self[EMITTER] = new Core()
      Utils.mixin(self, _)
    }
    return self
  }
}
Object.assign(Emit.prototype, _)
const a = new Emit