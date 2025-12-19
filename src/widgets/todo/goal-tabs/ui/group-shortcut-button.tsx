import { useThemeStore, selectIsDark } from 'entities/theme'

interface GroupShortcutButtonProps {
  onClick: () => void
}

export function GroupShortcutButton({ onClick }: GroupShortcutButtonProps) {
  const isDark = useThemeStore(selectIsDark)

  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        isDark
          ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <i className="ri-group-line flex h-4 w-4 items-center justify-center"></i>
      그룹 바로가기
    </button>
  )
}

