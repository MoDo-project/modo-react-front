import { useRef, useEffect } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'

interface GoalActionsMenuProps {
  open: boolean
  position: 'top' | 'bottom'
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function GoalActionsMenu({
  open,
  position,
  onEdit,
  onDelete,
  onClose,
}: GoalActionsMenuProps) {
  const isDark = useThemeStore(selectIsDark)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={menuRef}
      className={`absolute ${position === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'} right-0 z-50 overflow-hidden rounded-lg shadow-lg ${
        isDark ? 'bg-zinc-900' : 'bg-white'
      }`}
      style={{ minWidth: '120px' }}
      role="menu"
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
          isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-100'
        }`}
        role="menuitem"
      >
        <i className="ri-edit-line flex h-4 w-4 items-center justify-center"></i>
        편집
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className={`flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
          isDark ? 'text-red-400 hover:bg-zinc-800' : 'text-red-600 hover:bg-gray-100'
        }`}
        role="menuitem"
      >
        <i className="ri-delete-bin-line flex h-4 w-4 items-center justify-center"></i>
        삭제
      </button>
    </div>
  )
}

