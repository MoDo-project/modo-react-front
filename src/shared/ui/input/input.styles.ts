import { createVariants } from 'shared/lib/styles/variants'

export const inputVariants = createVariants({
  base: 'w-full rounded-lg px-4 py-3 text-sm transition-colors outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500',
  variants: {
    variant: {
      default: 'border bg-white dark:bg-zinc-800 text-black dark:text-white',
      filled: 'border-0 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white',
    },
    error: {
      true: 'border-red-500 focus:ring-2 focus:ring-red-500',
      false: 'border-gray-300 dark:border-zinc-700 focus:border-black dark:focus:border-white',
    },
  },
  defaultVariants: {
    variant: 'default',
    error: 'false',
  },
})
