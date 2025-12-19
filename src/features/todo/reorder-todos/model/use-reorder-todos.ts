import { useCallback } from 'react'
import type { Todo as UiTodo } from '@/types'
import { useReorderTodos } from '@/entities/todo'

/**
 * Todo 순서 변경 훅
 */
export const useReorderTodosFeature = () => {
  const reorderTodosMutation = useReorderTodos()

  const reorderTodos = useCallback(
    (reorderedTodos: UiTodo[]) => {
      if (reorderedTodos.length === 0) return

      // 모든 todos가 같은 parentId를 가져야 함
      const parentId = reorderedTodos[0].parentId ?? null
      const todoIds = reorderedTodos.map((todo) => todo.id)

      reorderTodosMutation.mutate({
        todoIds,
        parentId,
      })
    },
    [reorderTodosMutation]
  )

  return {
    reorderTodos,
  }
}

