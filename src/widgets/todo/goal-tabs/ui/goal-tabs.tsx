import type { Goal } from '@/types'
import { useGoalTabs } from '../model'
import { GoalTabsView } from './goal-tabs-view'

interface GoalTabsProps {
  goals: Goal[]
  selectedGoalId: string
  onSelectGoal: (id: string) => void
  onAddGoal: () => void
  onEditGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
}

/**
 * GoalTabs - thin wrapper 컴포넌트
 * - hook 호출하여 state/handler 받기
 * - view로 props 전달만 담당
 */
export function GoalTabs({
  goals,
  selectedGoalId,
  onSelectGoal,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
}: GoalTabsProps) {
  const { isMobile, activeTab, handleTabChange, goToGroups } = useGoalTabs({
    goals,
    selectedGoalId,
    onSelectGoal,
  })

  return (
    <GoalTabsView
      isMobile={isMobile}
      activeTab={activeTab}
      goals={goals}
      selectedGoalId={selectedGoalId}
      onSelectGoal={onSelectGoal}
      onAddGoal={onAddGoal}
      onEditGoal={onEditGoal}
      onDeleteGoal={onDeleteGoal}
      onTabChange={handleTabChange}
      onGoToGroups={goToGroups}
    />
  )
}
