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
    if (!_.hasEventName.call(this, ev))
      this[EMITTER][ev] = []
    const e = this[EMITTER]
    if (e[ev].indexOf(cb) === -1)
      e[ev].push(cb)
    return this
  },
  once(ev, cb) {
    validEventName(ev)
    validFunction(cb)
    const self = this
    if (!_.hasEventName.call(self, ev))
      self[EMITTER][ev] = []
    const e = self[EMITTER]
    e[ev].push(function (...args) {
      cb.apply(this, args)
      _.removeListenter.call(self, ev, cb)
    })
    return this
  },
  addListener(ev, cb, opt) {
    validEventName(ev)
    validFunction(cb)
    if (!_.hasEventName.call(this, ev))
      this[EMITTER][ev] = []
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
    _.hasEventName.call(this, ev)
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
  static mixin(self) {
    if (typeof self === "object" && self !== null) {
      if (!self[EMITTER]) self[EMITTER] = new Core()
      Utils.mixin(self, _)
    }
    return self
  }
  static __EMITTER__ = EMITTER
}
Object.assign(Emit.prototype, _)