import { apiClient } from '@/shared/api'

export type Todo = {
  id: string
  title: string
  description: string
  creatorId: number
  isCompleted: boolean
  createdAt: Date
  deadline: Date
  parentId: string | null
  path: string
  orderNumber: number
}

export type CreateTodoRequest = Pick<Todo, 'title' | 'description' | 'deadline' | 'parentId'>

export type CreateTodoResponse = Todo[]

export type UpdateTodoRequest = Partial<
  Pick<Todo, 'title' | 'description' | 'isCompleted' | 'deadline' | 'parentId' | 'orderNumber'>
> & {
  id: string
}

export type UpdateTodoResponse = Todo[]

export type ReorderTodosRequest = {
  todoIds: string[]
  parentId: string | null
}

export type ReorderTodosResponse = Todo[]

export type MoveTodosRequest = {
  todoIds: string[]
  parentId: string | null
}

export type MoveTodosResponse = Todo[]

export const todoApi = {
  getTodos: async () => {
    try {
      const res = await apiClient.get<Todo[]>('/todo/me')
      if (res.status === 200) {
        return res.data
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      throw new Error(`Failed to get todos ${e}`)
    }
  },

  createTodo: async (todo: CreateTodoRequest) => {
    try {
      const res = await apiClient.post<CreateTodoResponse>('/todo', todo)
      if (res.status === 201) {
        return res.data
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      throw new Error(`Failed to create todo ${e}`)
    }
  },

  updateTodo: async ({ id, ...updates }: UpdateTodoRequest) => {
    try {
      const res = await apiClient.patch<UpdateTodoResponse>(`/todo/${id}`, updates)
      if (res.status === 200) {
        return res.data
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      throw new Error(`Failed to update todo ${e}`)
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const res = await apiClient.delete(`/todo/${id}`)
      if (res.status === 200 || res.status === 204) {
        return true
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      throw new Error(`Failed to delete todo ${e}`)
    }
  },

  reorderTodos: async (request: ReorderTodosRequest) => {
    try {
      const res = await apiClient.patch<ReorderTodosResponse>('/todo/reorder', request)
      if (res.status === 200) {
        return res.data
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      throw new Error(`Failed to reorder todos ${e}`)
    }
  },

  moveTodos: async (request: MoveTodosRequest) => {
    try {
      const res = await apiClient.patch<MoveTodosResponse>('/todo/move', request)
      if (res.status === 200) {
        return res.data
      }
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      throw new Error(`Failed to move todos ${e}`)
    }
  },
}
