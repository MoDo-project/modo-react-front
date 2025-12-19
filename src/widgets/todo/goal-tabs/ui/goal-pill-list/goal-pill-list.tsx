import { useThemeStore, selectIsDark } from 'entities/theme'
import type { Goal } from '@/types'
import { GoalActionsMenu } from '../goal-actions-menu'
import { useGoalActionsMenu } from '../../model'

interface GoalPillListProps {
  goals: Goal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
}

export function GoalPillList({
  goals,
  selectedGoalId,
  onSelectGoal,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
}: GoalPillListProps) {
  const isDark = useThemeStore(selectIsDark)
  const { openGoalId, position, toggle, close } = useGoalActionsMenu()

  const handleGoalClick = (e: React.MouseEvent, goalId: string) => {
    const target = e.target as HTMLElement
    if (target.closest('.menu-trigger')) {
      const button = e.currentTarget as HTMLButtonElement
      const rect = button.getBoundingClientRect()
      toggle(goalId, rect)
    } else {
      onSelectGoal(goalId)
    }
  }

  const handleEdit = (goal: Goal) => {
    close()
    onEditGoal(goal)
  }

  const handleDelete = (goalId: string) => {
    close()
    onDeleteGoal(goalId)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {goals.map((goal) => (
        <div key={goal.id} className="relative">
          <button
            onClick={(e) => handleGoalClick(e, goal.id)}
            className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              selectedGoalId === goal.id
                ? isDark
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : isDark
                  ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i
              className={`${goal.icon} flex h-4 w-4 items-center justify-center`}
              style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}
            ></i>
            {goal.title}
            <span className="menu-trigger ml-1">
              <i className="ri-more-fill flex h-4 w-4 items-center justify-center"></i>
            </span>
          </button>
          <GoalActionsMenu
            open={openGoalId === goal.id}
            position={position}
            onEdit={() => handleEdit(goal)}
            onDelete={() => handleDelete(goal.id)}
            onClose={close}
          />
        </div>
      ))}

      <button
        onClick={onAddGoal}
        className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
          isDark
            ? 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <i className="ri-add-line"></i>
      </button>
    </div>
  )
}
