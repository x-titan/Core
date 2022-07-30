const {
  create,
  setPrototypeOf: set,
} = Object

export default function Core() {
  return (
    this instanceof Core
      ? this
      : new Core()
  )
}

set(Core, Core.prototype = create(null))
Core.prototype.constructor = Core
