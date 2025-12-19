import { useCallback } from 'react'
import { useUpdateTodo } from '@/entities/todo'

/**
 * Todo 업데이트 훅
 */
export const useUpdateTodoFeature = () => {
  const updateTodoMutation = useUpdateTodo()

  const updateTodo = useCallback(
    (id: string, title: string) => {
      updateTodoMutation.mutate({
        id,
        title,
      })
    },
    [updateTodoMutation]
  )

  return {
    updateTodo,
  }
}

