/**
 * Todo Handlers (Controller Layer)
 * Handles HTTP requests/responses and delegates business logic to service layer
 */
import { http, HttpResponse } from 'msw'
import type {
  Todo,
  CreateTodoRequest,
  CreateTodoResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
  ReorderTodoRequest,
  ReorderTodoResponse,
  MoveTodoRequest,
  MoveTodoResponse,
} from '../schema/todo'
import { getUserIdOrDefault } from '../utils/auth-utils'
import { BASE_URL } from '../utils/api-utils'
import * as todoService from '../services/todo-service'

/**
 * Convert todos to API response format
 */
const formatTodoResponse = (todos: Todo[]): Todo[] => {
  return todos.map((todo) => ({
    ...todo,
    createdAt: todo.createdAt,
    deadline: todo.deadline,
  }))
}

export const todoHandlers = [
  // GET /todo/me
  http.get(`${BASE_URL}/todo/me`, ({ request }) => {
    try {
      const userId = getUserIdOrDefault(request)
      const todos = todoService.getTodosByUser(userId)
      const response = formatTodoResponse(todos)

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Get todos error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // POST /todo
  http.post(`${BASE_URL}/todo`, async ({ request }) => {
    try {
      const userId = getUserIdOrDefault(request)
      const body = (await request.json()) as CreateTodoRequest

      // Validate request
      if (!body.title) {
        return HttpResponse.json({ message: 'Title is required' }, { status: 400 })
      }

      const todos = todoService.createTodo(userId, body)
      const response: CreateTodoResponse = formatTodoResponse(todos)

      return HttpResponse.json(response, { status: 201 })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Parent todo not found') {
          return HttpResponse.json({ message: error.message }, { status: 404 })
        }
      }
      console.error('Create todo error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // PATCH /todo/:id
  http.patch(`${BASE_URL}/todo/:id`, async ({ request, params }) => {
    try {
      const userId = getUserIdOrDefault(request)
      const todoId = parseInt(params.id as string)

      if (isNaN(todoId)) {
        return HttpResponse.json({ message: 'Invalid todo ID' }, { status: 400 })
      }

      const body = (await request.json()) as UpdateTodoRequest
      const result = todoService.updateTodo(userId, todoId, body)

      if (!result.success) {
        const status =
          result.error === 'Unauthorized'
            ? 403
            : result.error === 'Todo not found' || result.error === 'Parent todo not found'
              ? 404
              : 400
        return HttpResponse.json({ message: result.error }, { status })
      }

      const response: UpdateTodoResponse = formatTodoResponse(result.todos!)

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Update todo error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // PATCH /todo/reorder - 같은 depth에서 순서 변경
  http.patch(`${BASE_URL}/todo/reorder`, async ({ request }) => {
    try {
      const userId = getUserIdOrDefault(request)
      const body = (await request.json()) as ReorderTodoRequest

      // Validate request
      if (!Array.isArray(body.todoIds) || body.todoIds.length === 0) {
        return HttpResponse.json({ message: 'todoIds array is required' }, { status: 400 })
      }

      const result = todoService.reorderTodos(userId, body.todoIds, body.parentId)

      if (!result.success) {
        const status =
          result.error === 'Unauthorized' ? 403 : result.error?.includes('not found') ? 404 : 400
        return HttpResponse.json({ message: result.error }, { status })
      }

      const response: ReorderTodoResponse = formatTodoResponse(result.todos!)

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Reorder todos error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // PATCH /todo/move - todo의 depth 변경 (다른 부모로 이동)
  http.patch(`${BASE_URL}/todo/move`, async ({ request }) => {
    try {
      const userId = getUserIdOrDefault(request)
      const body = (await request.json()) as MoveTodoRequest

      // Validate request
      if (!Array.isArray(body.todoIds) || body.todoIds.length === 0) {
        return HttpResponse.json({ message: 'todoIds array is required' }, { status: 400 })
      }

      const result = todoService.moveTodos(userId, body.todoIds, body.parentId)

      if (!result.success) {
        const status =
          result.error === 'Unauthorized' ? 403 : result.error?.includes('not found') ? 404 : 400
        return HttpResponse.json({ message: result.error }, { status })
      }

      const response: MoveTodoResponse = formatTodoResponse(result.todos!)

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Move todos error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // DELETE /todo/:id
  http.delete(`${BASE_URL}/todo/:id`, ({ request, params }) => {
    try {
      const userId = getUserIdOrDefault(request)
      const todoId = parseInt(params.id as string)

      if (isNaN(todoId)) {
        return HttpResponse.json({ message: 'Invalid todo ID' }, { status: 400 })
      }

      const result = todoService.deleteTodo(userId, todoId)

      if (!result.success) {
        const status =
          result.error === 'Unauthorized' ? 403 : result.error === 'Todo not found' ? 404 : 400
        return HttpResponse.json({ message: result.error }, { status })
      }

      return HttpResponse.json(null, { status: 204 })
    } catch (error) {
      console.error('Delete todo error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),
]
