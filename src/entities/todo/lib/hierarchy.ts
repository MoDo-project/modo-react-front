import { Todo } from '@/types'

/**
 * 순수 함수: 특정 할일의 모든 하위 할일 ID 수집 (재귀)
 */
export const collectSubtaskIds = (todos: Todo[], parentId: string): string[] => {
  const subtasks = todos.filter((t) => t.parentId === parentId)
  const allIds = subtasks.map((t) => t.id)

  subtasks.forEach((subtask) => {
    allIds.push(...collectSubtaskIds(todos, subtask.id))
  })

  return allIds
}

/**
 * 순수 함수: 특정 할일과 모든 하위 할일 ID 반환
 */
export const getDeleteIds = (todos: Todo[], todoId: string): string[] => {
  return [todoId, ...collectSubtaskIds(todos, todoId)]
}

/**
 * 순수 함수: 최대 order 값 찾기
 */
export const getMaxOrder = (todos: Todo[], parentId?: string): number => {
  return todos
    .filter((t) => t.parentId === parentId)
    .reduce((max, t) => Math.max(max, t.order), -1)
}

/**
 * 순수 함수: 특정 goalId의 todos만 필터링
 */
export const filterByGoalId = (todos: Todo[], goalId: string): Todo[] => {
  return todos.filter((t) => t.goalId === goalId)
}

/**
 * 순수 함수: 특정 parentId의 직접 자식만 필터링
 */
export const filterDirectChildren = (todos: Todo[], parentId?: string): Todo[] => {
  return todos.filter((t) => t.parentId === parentId)
}

