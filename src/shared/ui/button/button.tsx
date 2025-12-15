import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from 'shared/lib/styles/cn'
import { buttonVariants } from './button.styles'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

/**
 * 순수 함수형 Button 컴포넌트
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   클릭
 * </Button>
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
