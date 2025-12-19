import { useCallback } from 'react'
import { useDeleteTodo } from '@/entities/todo'

/**
 * Todo 삭제 훅
 */
export const useDeleteTodoFeature = () => {
  const deleteTodoMutation = useDeleteTodo()

  const deleteTodo = useCallback(
    (id: string) => {
      deleteTodoMutation.mutate(id)
    },
    [deleteTodoMutation]
  )

  return {
    deleteTodo,
  }
}

