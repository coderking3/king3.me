/**
 * 深层递归所有属性为可选
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * 深层递归所有属性为只读
 */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * 任意类型的异步函数
 */

type AnyPromiseFunction<T extends any[] = any[], R = void> = (
  ...arg: T
) => PromiseLike<R>

/**
 * 任意类型的普通函数
 */
type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R

/**
 * 任意类型的函数
 */
type AnyFunction<T extends any[] = any[], R = void> =
  | AnyNormalFunction<T, R>
  | AnyPromiseFunction<T, R>

/**
 *  T | null 包装
 */
type Nullable<T> = null | T

/**
 * T | Not null 包装
 */
type NonNullable<T> = T extends null | undefined ? never : T

/**
 * 字符串类型对象
 */
type Recordable<T = any> = Record<string, T>

/**
 * 字符串类型对象（只读）
 */
interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T
}

/**
 * setTimeout 返回值类型
 */
type TimeoutHandle = ReturnType<typeof setTimeout>

/**
 * setInterval 返回值类型
 */
type IntervalHandle = ReturnType<typeof setInterval>

export type {
  AnyFunction,
  AnyNormalFunction,
  AnyPromiseFunction,
  DeepPartial,
  DeepReadonly,
  IntervalHandle,
  NonNullable,
  Nullable,
  ReadonlyRecordable,
  Recordable,
  TimeoutHandle
}
