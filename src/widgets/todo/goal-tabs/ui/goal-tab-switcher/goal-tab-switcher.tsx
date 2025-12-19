import { useThemeStore, selectIsDark } from 'entities/theme'

type TabValue = 'all' | 'personal' | 'group'

interface GoalTabSwitcherProps {
  value: TabValue
  onChange: (tab: TabValue) => void
  variant?: 'mobile' | 'desktop'
}

export function GoalTabSwitcher({ value, onChange, variant = 'desktop' }: GoalTabSwitcherProps) {
  const isDark = useThemeStore(selectIsDark)

  if (variant === 'mobile') {
    return (
      <div className={`relative rounded-full p-1 ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
        <div className="relative flex">
          {/* 슬라이더 인디케이터 */}
          <div
            className={`absolute top-1 bottom-1 rounded-full transition-all duration-300 ${
              isDark ? 'bg-white' : 'bg-black'
            }`}
            style={{
              left:
                value === 'all'
                  ? '0.25rem'
                  : value === 'personal'
                    ? 'calc(33.333% + 0.25rem)'
                    : 'calc(66.666% + 0.25rem)',
              width: 'calc(33.333% - 0.5rem)',
            }}
          />
          <button
            onClick={() => onChange('all')}
            className={`relative z-10 flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              value === 'all'
                ? isDark
                  ? 'text-black'
                  : 'text-white'
                : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
            }`}
          >
            전체보기
          </button>
          <button
            onClick={() => onChange('personal')}
            className={`relative z-10 flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              value === 'personal'
                ? isDark
                  ? 'text-black'
                  : 'text-white'
                : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
            }`}
          >
            개인
          </button>
          <button
            onClick={() => onChange('group')}
            className={`relative z-10 flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              value === 'group'
                ? isDark
                  ? 'text-black'
                  : 'text-white'
                : isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
            }`}
          >
            그룹
          </button>
        </div>
      </div>
    )
  }

  // Desktop variant는 단순히 전체보기 버튼만 표시
  return (
    <button
      onClick={() => onChange('all')}
      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        value === 'all'
          ? isDark
            ? 'bg-white text-black'
            : 'bg-black text-white'
          : isDark
            ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      전체보기
    </button>
  )
}
