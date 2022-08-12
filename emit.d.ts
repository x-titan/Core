import Base from "./base.js"
declare class Emit extends Base {
  on(eventName: string | symbol, callback: (...args: any[]) => void): this
  once(eventName: string | symbol, callback: (...args: any[]) => void): this
  addListener(eventName: string | symbol, callback: (...args: any[]) => void, options: ?{ once: boolean }): this
  removeAllListenter(eventName: string | symbol): this
  removeListenter(eventName: string | symbol, callback: (...args: any[]) => void): this
  emit(eventName: string | symbol, ...args: any[]): this
}
export default Emit