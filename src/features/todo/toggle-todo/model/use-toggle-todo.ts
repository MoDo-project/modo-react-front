import { useCallback } from 'react'
import { useToggleTodo } from '@/entities/todo'

/**
 * Todo 완료 상태 토글 훅
 */
export const useToggleTodoFeature = () => {
  const toggleTodoMutation = useToggleTodo()

  const toggleTodo = useCallback(
    (id: string, isCompleted: boolean) => {
      toggleTodoMutation.mutate({
        id,
        isCompleted,
      })
    },
    [toggleTodoMutation]
  )

  return {
    toggleTodo,
  }
}

