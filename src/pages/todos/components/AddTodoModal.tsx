import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { Goal } from '../../../types'

interface AddTodoModalProps {
  goals: Goal[]
  onClose: () => void
  onAdd: (goalId: string, title: string) => void
  defaultGoalId?: string
  isSubtask?: boolean
}

export default function AddTodoModal({
  goals,
  onClose,
  onAdd,
  defaultGoalId,
  isSubtask,
}: AddTodoModalProps) {
  const isDark = useThemeStore(selectIsDark)
  const [title, setTitle] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState(defaultGoalId || goals[0]?.id || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && selectedGoalId) {
      onAdd(selectedGoalId, title.trim())
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {isSubtask ? '하위 할일 추가' : '할일 추가'}
          </h2>
          <button
            onClick={onClose}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-close-line flex h-5 w-5 items-center justify-center text-xl ${isDark ? 'text-white' : 'text-black'}`}
            ></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              목표 선택
            </label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedGoalId === goal.id
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-black text-white'
                      : isDark
                        ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i
                    className={`${goal.icon} flex h-4 w-4 items-center justify-center`}
                    style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}
                  ></i>
                  {goal.title}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              할일 내용
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-lg px-4 py-3 text-sm ${
                isDark
                  ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                  : 'border border-gray-200 bg-gray-50 text-black focus:border-gray-300'
              } transition-colors outline-none`}
              placeholder="할일을 입력하세요"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className={`w-full cursor-pointer rounded-lg py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              title.trim()
                ? isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-900'
                : isDark
                  ? 'cursor-not-allowed bg-zinc-800 text-gray-600'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
            }`}
          >
            추가하기
          </button>
        </form>
      </div>
    </div>
  )
}
