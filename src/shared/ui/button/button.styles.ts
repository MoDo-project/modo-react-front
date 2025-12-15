import { createVariants } from 'shared/lib/styles/variants'

export const buttonVariants = createVariants({
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
  variants: {
    variant: {
      primary:
        'bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100',
      secondary:
        'bg-gray-200 text-black hover:bg-gray-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700',
      ghost: 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
