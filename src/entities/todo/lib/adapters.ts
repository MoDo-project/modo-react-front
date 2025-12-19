import type { Todo as ApiTodo } from '../api/todo-api'
import type { Todo as UiTodo } from '@/types'

/**
 * API Todo 타입을 UI Todo 타입으로 변환
 */
export function apiTodoToUiTodo(apiTodo: ApiTodo): UiTodo {
  return {
    id: String(apiTodo.id),
    goalId: apiTodo.parentId ? String(apiTodo.parentId) : String(apiTodo.id), // parentId가 null이면 자기 자신이 Goal
    title: apiTodo.title,
    completed: apiTodo.isCompleted,
    createdAt: new Date(apiTodo.createdAt),
    parentId: apiTodo.parentId ? String(apiTodo.parentId) : undefined,
    order: apiTodo.orderNumber,
  }
}

/**
 * UI Todo 타입을 API CreateTodoRequest로 변환
 */
export function uiTodoToApiRequest(
  uiTodo: Pick<UiTodo, 'title'> & { description?: string; deadline?: Date; parentId?: string }
) {
  return {
    title: uiTodo.title,
    description: uiTodo.description || '',
    deadline: uiTodo.deadline || new Date(),
    parentId: uiTodo.parentId ? Number(uiTodo.parentId) : null,
  }
}

/**
 * 여러 API todos를 UI todos로 일괄 변환
 */
export function apiTodosToUiTodos(apiTodos: ApiTodo[]): UiTodo[] {
  return apiTodos.map(apiTodoToUiTodo)
}
