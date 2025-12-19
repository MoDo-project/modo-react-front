import type { Goal } from '@/types'

/**
 * selectedGoalId로부터 현재 탭 상태를 계산
 * @param selectedGoalId - 선택된 Goal ID ('all' 또는 Goal ID)
 * @param goals - Goal 목록
 * @returns 'all' | 'personal'
 */
export function getTabFromSelectedGoal(
  selectedGoalId: string,
  goals: Goal[]
): 'all' | 'personal' {
  if (selectedGoalId === 'all') {
    return 'all'
  }
  const goal = goals.find((g) => g.id === selectedGoalId)
  return goal ? 'personal' : 'all'
}

