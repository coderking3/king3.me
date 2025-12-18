/**
 *  T | null 包装
 */
type Nullable<T> = null | T

/**
 * 字符串类型对象
 */
type Recordable<T> = Record<string, T>

export type { Nullable, Recordable }
