import { useCallback } from 'react'
import { useCreateTodo, uiTodoToApiRequest } from '@/entities/todo'
import { determineParentId } from '../lib'

interface CreateTodoParams {
  goalId: string
  title: string
  parentTodoId: string | null
  selectedGoalId: string
  onSuccess?: () => void
}

/**
 * Todo 생성 훅
 * - Goal 생성 또는 일반 Todo 생성 지원
 * - parentId 계산 로직 포함
 */
export const useCreateTodoFeature = () => {
  const createTodoMutation = useCreateTodo()

  const createTodo = useCallback(
    ({ goalId, title, parentTodoId, selectedGoalId, onSuccess }: CreateTodoParams) => {
      const parentId: string | null = determineParentId(parentTodoId, selectedGoalId, goalId)

      const todoRequest = uiTodoToApiRequest({
        title,
        description: '',
        parentId,
      })

      createTodoMutation.mutate(todoRequest, {
        onSuccess: () => {
          onSuccess?.()
        },
        onError: (error) => {
          console.error('❌ Todo creation failed:', error)
        },
      })
    },
    [createTodoMutation]
  )

  return {
    createTodo,
  }
}

