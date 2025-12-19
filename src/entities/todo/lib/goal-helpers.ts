import type { Todo as UiTodo } from '@/types'
import type { Goal } from '@/types'

/**
 * parentId가 null인 todos를 Goals로 변환
 */
export function todosToGoals(todos: UiTodo[]): Goal[] {
  return todos
    .filter((todo) => !todo.parentId)
    .map((todo) => ({
      id: todo.id,
      title: todo.title,
      color: '#EF4444', // 기본 색상 (TODO: Todo에 color 필드 추가 필요)
      icon: 'ri-flag-line', // 기본 아이콘 (TODO: Todo에 icon 필드 추가 필요)
    }))
}

/**
 * Goal의 하위 todos만 필터링
 */
export function getGoalTodos(todos: UiTodo[], goalId: string): UiTodo[] {
  return todos.filter((todo) => todo.parentId === goalId)
}
