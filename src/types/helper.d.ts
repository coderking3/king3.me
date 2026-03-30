/* --- Recursive utilities --- */

/** Recursively makes all properties optional */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/** Recursively makes all properties readonly */
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/* --- Function types --- */

type AnyPromiseFunction<T extends any[] = any[], R = void> = (
  ...arg: T
) => PromiseLike<R>

type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R

type AnyFunction<T extends any[] = any[], R = void> =
  | AnyNormalFunction<T, R>
  | AnyPromiseFunction<T, R>

/* --- Wrapper types --- */

/** T | null */
type Nullable<T> = null | T

/** Exclude null and undefined from T */
type NonNullable<T> = T extends null | undefined ? never : T

/* --- Record types --- */

type Recordable<T = any> = Record<string, T>

interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T
}

/* --- Timer types --- */

type TimeoutHandle = ReturnType<typeof setTimeout>

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
