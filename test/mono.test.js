const Mono = require('../mono.js').default

test("new Mono", () => {
  expect(() => new Mono()).toThrow()
})

test("Try new A with extends Mono", () => {
  class A extends Mono { }
  expect(new A).toBeDefined()
  expect(() => new A).toThrow()
})

test("Try new other A with extends Mono", () => {
  class A extends Mono { }
  expect(new A).toBeDefined()
  expect(() => new A).toThrow()
})

test("Try new B with Mono mixin", () => {
  class B {
    constructor() {
      Mono.mixin(this)
    }
  }
  expect(new B).toBeDefined()
  expect(() => new B).toThrow()
})

test("Try new C with Mono mono", () => {
  const C = Mono.mono(function () { })
  expect(new C).toBeDefined()
  expect(() => new C).toThrow()
})