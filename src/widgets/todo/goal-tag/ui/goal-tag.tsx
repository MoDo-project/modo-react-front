import type { Goal } from '@/types'

interface GoalTagProps {
  goal: Goal
}

/**
 * Goal Tag 컴포넌트
 * - Goal의 색상과 제목을 표시하는 태그
 * - parentId가 null인 경우(Goal 자체)에는 표시하지 않음
 */
export function GoalTag({ goal }: GoalTagProps) {
  return (
    <div
      className="rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
    >
      {goal.title}
    </div>
  )
}

