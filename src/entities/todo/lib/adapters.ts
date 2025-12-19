import type { Todo as ApiTodo, CreateTodoRequest } from '../api/todo-api'
import type { Todo as UiTodo } from '@/types'

/**
 * path에서 최상위 Goal ID를 추출
 * 예: path "1.2.3" -> orderNumber 1 -> 해당 ID 찾기
 */
function findRootGoalId(apiTodo: ApiTodo, allTodos: ApiTodo[]): string {
  // parentId가 null이면 자기 자신이 Goal
  if (apiTodo.parentId === null) {
    return apiTodo.id
  }

  // path의 첫 번째 숫자가 최상위 Goal의 orderNumber
  const pathParts = apiTodo.path.split('.')
  const rootOrderNumber = parseInt(pathParts[0])

  // orderNumber와 parentId가 null인 todo를 찾기 (최상위 Goal)
  const rootGoal = allTodos.find((t) => t.parentId === null && t.orderNumber === rootOrderNumber)

  return rootGoal ? rootGoal.id : apiTodo.id
}

/**
 * API Todo 타입을 UI Todo 타입으로 변환 (단일)
 */
export function apiTodoToUiTodo(apiTodo: ApiTodo, allTodos: ApiTodo[]): UiTodo {
  return {
    id: apiTodo.id,
    goalId: findRootGoalId(apiTodo, allTodos),
    title: apiTodo.title,
    completed: apiTodo.isCompleted,
    createdAt: new Date(apiTodo.createdAt),
    parentId: apiTodo.parentId ?? null,
    order: apiTodo.orderNumber,
  }
}

/**
 * UI Todo 타입을 API CreateTodoRequest로 변환
 */
export function uiTodoToApiRequest(
  uiTodo: Pick<UiTodo, 'title'> & {
    description?: string
    deadline?: Date
    parentId?: string | null
  }
): CreateTodoRequest {
  const parentId: string | null = uiTodo.parentId ?? null
  return {
    title: uiTodo.title,
    description: uiTodo.description || '',
    deadline: uiTodo.deadline || new Date(),
    parentId,
  }
}

/**
 * 여러 API todos를 UI todos로 일괄 변환
 */
export function apiTodosToUiTodos(apiTodos: ApiTodo[]): UiTodo[] {
  return apiTodos.map((todo) => apiTodoToUiTodo(todo, apiTodos))
}
