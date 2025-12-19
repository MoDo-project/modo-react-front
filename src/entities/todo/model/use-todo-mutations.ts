import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  todoApi,
  type CreateTodoRequest,
  type UpdateTodoRequest,
  type ReorderTodosRequest,
  type MoveTodosRequest,
} from '../api/todo-api'
import { handleApiError } from '@/shared/api'
import { todoKeys } from './keys'

/**
 * 새로운 todo를 생성하는 mutation hook
 */
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todo: CreateTodoRequest) => todoApi.createTodo(todo),
    onSuccess: (data) => {
      if (!data) return

      // todos 목록 갱신
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })

      if (import.meta.env.DEV) {
        console.log('Todo created successfully:', data)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Failed to create todo:', error)
      }
    },
  })
}

/**
 * todo를 업데이트하는 mutation hook
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: UpdateTodoRequest) => todoApi.updateTodo(updates),
    onSuccess: (data) => {
      if (!data) return

      // todos 목록 갱신
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })

      if (import.meta.env.DEV) {
        console.log('Todo updated successfully:', data)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Failed to update todo:', error)
      }
    },
  })
}

/**
 * todo 완료 상태를 토글하는 mutation hook
 */
export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: number; isCompleted: boolean }) =>
      todoApi.updateTodo({ id, isCompleted }),
    onSuccess: (data) => {
      if (!data) return

      // todos 목록 갱신
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })

      if (import.meta.env.DEV) {
        console.log('Todo toggled successfully:', data)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Failed to toggle todo:', error)
      }
    },
  })
}

/**
 * todo를 삭제하는 mutation hook
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onSuccess: () => {
      // todos 목록 갱신
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })

      if (import.meta.env.DEV) {
        console.log('Todo deleted successfully')
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Failed to delete todo:', error)
      }
    },
  })
}

/**
 * 같은 depth에서 todo 순서를 변경하는 mutation hook
 */
export function useReorderTodos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: ReorderTodosRequest) => todoApi.reorderTodos(request),
    onSuccess: (data) => {
      if (!data) return

      // todos 목록 갱신
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })

      if (import.meta.env.DEV) {
        console.log('Todos reordered successfully:', data)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Failed to reorder todos:', error)
      }
    },
  })
}

/**
 * todo를 다른 부모로 이동하는 mutation hook
 */
export function useMoveTodos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: MoveTodosRequest) => todoApi.moveTodos(request),
    onSuccess: (data) => {
      if (!data) return

      // todos 목록 갱신
      queryClient.invalidateQueries({ queryKey: todoKeys.list() })

      if (import.meta.env.DEV) {
        console.log('Todos moved successfully:', data)
      }
    },
    onError: (error) => {
      handleApiError(error)
      if (import.meta.env.DEV) {
        console.error('Failed to move todos:', error)
      }
    },
  })
}
