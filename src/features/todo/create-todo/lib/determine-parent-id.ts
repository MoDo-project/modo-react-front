/**
 * Todo 생성 시 parentId를 결정하는 로직
 * - parentTodoId가 있으면 하위 할일로 추가
 * - parentTodoId가 없고 전체보기면 null (Goal 생성)
 * - parentTodoId가 없고 특정 Goal 선택이면 goalId (Goal의 자식으로 추가)
 */
export const determineParentId = (
  parentTodoId: string | null,
  selectedGoalId: string,
  goalId: string
): string | null => {
  // Goal 생성 여부 확인: 전체보기이고 parentTodoId가 없으면 Goal 생성
  const isGoal = selectedGoalId === 'all' && parentTodoId === null

  if (isGoal) {
    return null // Goal 생성
  }

  // 하위 할일이거나 특정 Goal의 자식으로 추가
  return parentTodoId ?? goalId
}

