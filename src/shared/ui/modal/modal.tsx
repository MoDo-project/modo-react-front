import { ReactNode, useEffect } from 'react'
import { cn } from 'shared/lib/styles/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

/**
 * 재사용 가능한 Modal 컴포넌트
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="새 목표">
 *   <form>...</form>
 * </Modal>
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          'max-h-[90vh] w-full overflow-y-auto rounded-2xl p-6',
          'bg-white dark:bg-zinc-900',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="mb-6 flex items-center justify-between">
            {title && <h2 className="text-xl font-semibold text-black dark:text-white">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <i className="ri-close-line text-xl text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
