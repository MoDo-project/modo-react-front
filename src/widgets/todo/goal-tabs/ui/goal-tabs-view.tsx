import type { Goal } from '@/types'
import { GoalTabSwitcher } from './goal-tab-switcher'
import { GoalPillList } from './goal-pill-list'
import { GroupShortcutButton } from './group-shortcut-button'

interface GoalTabsViewProps {
  isMobile: boolean
  activeTab: 'all' | 'personal'
  goals: Goal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
  onTabChange: (tab: 'all' | 'personal' | 'group') => void
  onGoToGroups: () => void
}

/**
 * GoalTabs의 순수 View 컴포넌트
 * - JSX만 담당, side-effect 없음
 * - 모든 로직은 props로 받음
 * - 테스트/스토리북에서 props만으로 렌더링 가능
 */
export function GoalTabsView({
  isMobile,
  activeTab,
  goals,
  selectedGoalId,
  onSelectGoal,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onTabChange,
  onGoToGroups,
}: GoalTabsViewProps) {
  if (isMobile) {
    return (
      <div className="mb-4">
        <GoalTabSwitcher value={activeTab} onChange={onTabChange} variant="mobile" />

        {activeTab === 'personal' && (
          <div className="mt-4">
            <GoalPillList
              goals={goals}
              selectedGoalId={selectedGoalId}
              onSelectGoal={onSelectGoal}
              onAddGoal={onAddGoal}
              onEditGoal={onEditGoal}
              onDeleteGoal={onDeleteGoal}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <GoalTabSwitcher value={activeTab} onChange={onTabChange} variant="desktop" />

      <GoalPillList
        goals={goals}
        selectedGoalId={selectedGoalId}
        onSelectGoal={onSelectGoal}
        onAddGoal={onAddGoal}
        onEditGoal={onEditGoal}
        onDeleteGoal={onDeleteGoal}
      />

      <GroupShortcutButton onClick={onGoToGroups} />
    </div>
  )
}
