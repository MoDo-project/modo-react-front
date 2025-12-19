import type { Todo as UiTodo } from '@/types'
import type { Goal } from '@/types'

/**
 * parentId가 null인 todos를 Goals로 변환
 */
export function todosToGoals(todos: UiTodo[]): Goal[] {
  return todos
    .filter((todo) => todo.parentId === null)
    .map((todo) => ({
      id: todo.id,
      title: todo.title,
      color: '#EF4444', // 기본 색상 (TODO: Todo에 color 필드 추가 필요)
      icon: 'ri-flag-line', // 기본 아이콘 (TODO: Todo에 icon 필드 추가 필요)
    }))
}

/**
 * Goal의 직계 자식 todos만 필터링 (바로 아래 레벨)
 */
export function getGoalTodos(todos: UiTodo[], goalId: string): UiTodo[] {
  return todos.filter((todo) => todo.parentId === goalId)
}

/**
 * Goal에 속한 모든 하위 todos 필터링 (전체 하위 트리)
 */
export function getAllGoalTodos(todos: UiTodo[], goalId: string): UiTodo[] {
  return todos.filter((todo) => todo.goalId === goalId && todo.parentId !== null)
}
