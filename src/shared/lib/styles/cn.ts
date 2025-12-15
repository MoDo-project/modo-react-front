import clsx, { ClassValue } from 'clsx'

/**
 * className을 조합하는 순수 함수
 * @example cn('text-red-500', isDark && 'bg-black', 'p-4')
 */
export const cn = (...inputs: ClassValue[]): string => clsx(inputs)
