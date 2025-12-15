/**
 * 순수 함수: 왼쪽에서 오른쪽으로 함수 조합
 * @example pipe(add1, multiply2, subtract3)(5) // (5 + 1) * 2 - 3 = 9
 */
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T =>
    fns.reduce((acc, fn) => fn(acc), value)

/**
 * 타입 안전한 pipe (다른 타입 반환 가능)
 */
type PipeFunc = <T>(value: T) => any

export const pipeSafe =
  (...fns: PipeFunc[]) =>
  (value: any) =>
    fns.reduce((acc, fn) => fn(acc), value)
