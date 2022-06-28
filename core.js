const { setPrototypeOf: sProt, create } = Object

export default function Core() {
  return (
    this instanceof Core
      ? this
      : new Core()
  )
}

sProt(Core, Core.prototype = create(null))
Core.prototype.constructor = Core
