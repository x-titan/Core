import Base from "./base.js"
declare class Emit extends Base {
  hasEventName(eventName: string | symbol): boolean
  hasListener(eventName: string | symbol, callback: (...args: any[]) => void): boolean
  on(eventName: string | symbol, callback: (...args: any[]) => void): this
  once(eventName: string | symbol, callback: (...args: any[]) => void): this
  addListener(eventName: string | symbol, callback: (...args: any[]) => void, options: ?{ once: boolean }): this
  removeAllListenter(eventName: string | symbol): this
  removeListenter(eventName: string | symbol, callback: (...args: any[]) => void): this
  emit(eventName: string | symbol, ...args: any[]): this
  static mixin<T>(obj: T): T & Emit
}
export default Emit