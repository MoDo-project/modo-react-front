import { http, HttpResponse } from 'msw'
import { db } from '../db/db'
import type {
  Todo,
  CreateTodoRequest,
  CreateTodoResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '../schema/todo'

// Match the exact baseURL from apiClient
const getBaseURL = () => {
  const raw = import.meta.env.VITE_API_BASE_URL || 'https://modo-api.khoon.kr/api/v1'
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}
const BASE_URL = getBaseURL()

// Helper to extract user ID from token
const getUserIdFromToken = (request: Request): number | null => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  // Extract user ID from mock token (format: mock_token_{userId}_{username}_{timestamp})
  const parts = token.split('_')
  if (parts.length >= 3) {
    const userId = parseInt(parts[2])
    return isNaN(userId) ? null : userId
  }

  return null
}

export const todoHandlers = [
  // GET /todo/me
  http.get(`${BASE_URL}/todo/me`, ({ request }) => {
    try {
      // Verify authentication (fallback to user 1 for testing)
      let userId = getUserIdFromToken(request)

      // For testing: if no token, use first user
      if (!userId) {
        console.warn('⚠️ MSW: No auth token found, using default user (id: 1) for testing')
        userId = 1
      }

      // Get user's todos
      const todos = db.getTodosByCreatorId(userId)

      // Convert Date objects to match API response
      const response: Todo[] = todos.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt,
        deadline: todo.deadline,
      }))

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Get todos error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // POST /todo
  http.post(`${BASE_URL}/todo`, async ({ request }) => {
    try {
      // Verify authentication (fallback to user 1 for testing)
      let userId = getUserIdFromToken(request)

      // For testing: if no token, use first user
      if (!userId) {
        console.warn('⚠️ MSW: No auth token found, using default user (id: 1) for testing')
        userId = 1
      }

      const body = (await request.json()) as CreateTodoRequest

      // Validate request
      if (!body.title) {
        return HttpResponse.json({ message: 'Title is required' }, { status: 400 })
      }

      // Calculate path and order number
      let path = ''
      let orderNumber = 1

      if (body.parentId) {
        const parentTodo = db.getTodoById(body.parentId)
        if (!parentTodo) {
          return HttpResponse.json({ message: 'Parent todo not found' }, { status: 404 })
        }
        path = `${parentTodo.path}.${parentTodo.id}`

        // Count siblings to determine order number
        const siblings = db.getTodosByCreatorId(userId).filter((t) => t.parentId === body.parentId)
        orderNumber = siblings.length + 1
      } else {
        // Root level todo
        const rootTodos = db.getTodosByCreatorId(userId).filter((t) => t.parentId === null)
        orderNumber = rootTodos.length + 1
        path = `${orderNumber}`
      }

      // Create new todo
      const newTodo = db.addTodo({
        title: body.title,
        description: body.description || '',
        creatorId: userId,
        isCompleted: false,
        createdAt: new Date(),
        deadline: new Date(body.deadline),
        parentId: body.parentId || null,
        path,
        orderNumber,
      })

      // Return all todos (as per API behavior)
      const allTodos = db.getTodosByCreatorId(userId)

      const response: CreateTodoResponse = allTodos.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt,
        deadline: todo.deadline,
      }))

      return HttpResponse.json(response, { status: 201 })
    } catch (error) {
      console.error('Create todo error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),

  // PATCH /todo/:id
  http.patch(`${BASE_URL}/todo/:id`, async ({ request, params }) => {
    try {
      // Verify authentication (fallback to user 1 for testing)
      let userId = getUserIdFromToken(request)

      // For testing: if no token, use first user
      if (!userId) {
        console.warn('⚠️ MSW: No auth token found, using default user (id: 1) for testing')
        userId = 1
      }

      const todoId = parseInt(params.id as string)
      if (isNaN(todoId)) {
        return HttpResponse.json({ message: 'Invalid todo ID' }, { status: 400 })
      }

      // Find todo
      const todo = db.getTodoById(todoId)
      if (!todo) {
        return HttpResponse.json({ message: 'Todo not found' }, { status: 404 })
      }

      // Check ownership
      if (todo.creatorId !== userId) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 403 })
      }

      const body = (await request.json()) as UpdateTodoRequest

      // Update todo
      const updates: Partial<Todo> = {}

      if (body.title !== undefined) updates.title = body.title
      if (body.description !== undefined) updates.description = body.description
      if (body.isCompleted !== undefined) updates.isCompleted = body.isCompleted
      if (body.deadline !== undefined) updates.deadline = new Date(body.deadline)
      if (body.orderNumber !== undefined) updates.orderNumber = body.orderNumber

      // Handle parentId change (requires recalculating path)
      if (body.parentId !== undefined && body.parentId !== todo.parentId) {
        if (body.parentId === null) {
          // Moving to root level
          const rootTodos = db
            .getTodosByCreatorId(userId)
            .filter((t) => t.parentId === null && t.id !== todoId)
          updates.orderNumber = rootTodos.length + 1
          updates.path = `${updates.orderNumber}`
          updates.parentId = null
        } else {
          // Moving under a parent
          const parentTodo = db.getTodoById(body.parentId)
          if (!parentTodo) {
            return HttpResponse.json({ message: 'Parent todo not found' }, { status: 404 })
          }

          // Check if trying to move under itself or its descendants
          if (todoId === body.parentId || parentTodo.path.includes(`${todo.path}.`)) {
            return HttpResponse.json(
              { message: 'Cannot move todo under itself or its descendants' },
              { status: 400 }
            )
          }

          updates.path = `${parentTodo.path}.${parentTodo.id}`
          updates.parentId = body.parentId

          // Count siblings to determine order number
          const siblings = db
            .getTodosByCreatorId(userId)
            .filter((t) => t.parentId === body.parentId && t.id !== todoId)
          updates.orderNumber = siblings.length + 1
        }
      }

      const updatedTodo = db.updateTodo(todoId, updates)
      if (!updatedTodo) {
        return HttpResponse.json({ message: 'Failed to update todo' }, { status: 500 })
      }

      // Return all todos (as per API behavior)
      const allTodos = db.getTodosByCreatorId(userId)

      const response: UpdateTodoResponse = allTodos.map((todo) => ({
        ...todo,
        createdAt: todo.createdAt,
        deadline: todo.deadline,
      }))

      return HttpResponse.json(response, { status: 200 })
    } catch (error) {
      console.error('Update todo error:', error)
      return HttpResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
  }),
]
