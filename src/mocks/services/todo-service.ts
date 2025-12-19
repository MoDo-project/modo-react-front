/**
 * Todo Service - Business logic for todo operations
 */
import { db } from '../db/db'
import type { Todo } from '../schema/todo'
import type { CreateTodoRequest, UpdateTodoRequest } from '../schema/todo'

/**
 * Get all todos for a user
 */
export const getTodosByUser = (userId: number): Todo[] => {
  return db.getTodosByCreatorId(userId)
}

/**
 * Create a new todo
 */
export const createTodo = (userId: number, data: CreateTodoRequest): Todo[] => {
  // Calculate path and order number
  let path = ''
  let orderNumber = 1

  if (data.parentId) {
    const parentTodo = db.getTodoById(data.parentId)
    if (!parentTodo) {
      throw new Error('Parent todo not found')
    }
    path = `${parentTodo.path}.${parentTodo.id}`

    // Count siblings to determine order number
    const siblings = db.getTodosByCreatorId(userId).filter((t) => t.parentId === data.parentId)
    orderNumber = siblings.length + 1
  } else {
    // Root level todo
    const rootTodos = db.getTodosByCreatorId(userId).filter((t) => t.parentId === null)
    orderNumber = rootTodos.length + 1
    path = `${orderNumber}`
  }

  // Create new todo
  db.addTodo({
    title: data.title,
    description: data.description || '',
    creatorId: userId,
    isCompleted: false,
    createdAt: new Date(),
    deadline: new Date(data.deadline),
    parentId: data.parentId || null,
    path,
    orderNumber,
  })

  // Return all todos
  return getTodosByUser(userId)
}

/**
 * Update an existing todo
 */
export const updateTodo = (
  userId: number,
  todoId: number,
  data: UpdateTodoRequest
): { success: boolean; todos?: Todo[]; error?: string } => {
  // Find todo
  const todo = db.getTodoById(todoId)
  if (!todo) {
    return { success: false, error: 'Todo not found' }
  }

  // Check ownership
  if (todo.creatorId !== userId) {
    return { success: false, error: 'Unauthorized' }
  }

  // Prepare updates
  const updates: Partial<Todo> = {}

  if (data.title !== undefined) updates.title = data.title
  if (data.description !== undefined) updates.description = data.description
  if (data.isCompleted !== undefined) updates.isCompleted = data.isCompleted
  if (data.deadline !== undefined) updates.deadline = new Date(data.deadline)
  if (data.orderNumber !== undefined) updates.orderNumber = data.orderNumber

  // Handle parentId change (requires recalculating path)
  if (data.parentId !== undefined && data.parentId !== todo.parentId) {
    if (data.parentId === null) {
      // Moving to root level
      const rootTodos = db
        .getTodosByCreatorId(userId)
        .filter((t) => t.parentId === null && t.id !== todoId)
      updates.orderNumber = rootTodos.length + 1
      updates.path = `${updates.orderNumber}`
      updates.parentId = null
    } else {
      // Moving under a parent
      const parentTodo = db.getTodoById(data.parentId)
      if (!parentTodo) {
        return { success: false, error: 'Parent todo not found' }
      }

      // Check if trying to move under itself or its descendants
      if (todoId === data.parentId || parentTodo.path.includes(`${todo.path}.`)) {
        return { success: false, error: 'Cannot move todo under itself or its descendants' }
      }

      updates.path = `${parentTodo.path}.${parentTodo.id}`
      updates.parentId = data.parentId

      // Count siblings to determine order number
      const siblings = db
        .getTodosByCreatorId(userId)
        .filter((t) => t.parentId === data.parentId && t.id !== todoId)
      updates.orderNumber = siblings.length + 1
    }
  }

  const updatedTodo = db.updateTodo(todoId, updates)
  if (!updatedTodo) {
    return { success: false, error: 'Failed to update todo' }
  }

  return { success: true, todos: getTodosByUser(userId) }
}

/**
 * Reorder todos within the same depth
 */
export const reorderTodos = (
  userId: number,
  todoIds: number[],
  parentId: number | null
): { success: boolean; todos?: Todo[]; error?: string } => {
  // Verify all todos exist and belong to the user
  const todos: Todo[] = []
  for (const todoId of todoIds) {
    const todo = db.getTodoById(todoId)
    if (!todo) {
      return { success: false, error: `Todo ${todoId} not found` }
    }
    if (todo.creatorId !== userId) {
      return { success: false, error: 'Unauthorized' }
    }
    todos.push(todo)
  }

  // Verify all todos have the same parentId
  for (const todo of todos) {
    if (todo.parentId !== parentId) {
      return { success: false, error: 'All todos must have the same parentId for reordering' }
    }
  }

  // Update order numbers based on the array order
  todos.forEach((todo, index) => {
    db.updateTodo(todo.id, { orderNumber: index + 1 })
  })

  return { success: true, todos: getTodosByUser(userId) }
}

/**
 * Move todos to a different parent (change depth)
 */
export const moveTodos = (
  userId: number,
  todoIds: number[],
  targetParentId: number | null
): { success: boolean; todos?: Todo[]; error?: string } => {
  // If moving to a parent, verify it exists
  let targetParent: Todo | undefined
  if (targetParentId !== null) {
    targetParent = db.getTodoById(targetParentId)
    if (!targetParent) {
      return { success: false, error: 'Target parent not found' }
    }
    if (targetParent.creatorId !== userId) {
      return { success: false, error: 'Unauthorized' }
    }
  }

  // Verify all todos exist and belong to the user
  const todos: Todo[] = []
  for (const todoId of todoIds) {
    const todo = db.getTodoById(todoId)
    if (!todo) {
      return { success: false, error: `Todo ${todoId} not found` }
    }
    if (todo.creatorId !== userId) {
      return { success: false, error: 'Unauthorized' }
    }

    // Prevent moving under itself or its descendants
    if (targetParentId !== null) {
      if (todoId === targetParentId) {
        return { success: false, error: 'Cannot move todo under itself' }
      }
      if (targetParent && targetParent.path.startsWith(`${todo.path}.`)) {
        return { success: false, error: 'Cannot move todo under its descendants' }
      }
    }

    todos.push(todo)
  }

  // Get existing siblings in target location (excluding todos being moved)
  const existingSiblings = db
    .getTodosByCreatorId(userId)
    .filter((t) => t.parentId === targetParentId && !todoIds.includes(t.id))

  // Calculate new path and update each todo
  todos.forEach((todo, index) => {
    const updates: Partial<Todo> = {
      parentId: targetParentId,
      orderNumber: existingSiblings.length + index + 1,
    }

    // Calculate new path
    if (targetParentId === null) {
      // Moving to root level
      updates.path = `${updates.orderNumber}`
    } else {
      // Moving under a parent
      updates.path = `${targetParent!.path}.${targetParent!.id}`
    }

    db.updateTodo(todo.id, updates)

    // Update paths of all descendants if this todo has children
    const allUserTodos = db.getTodosByCreatorId(userId)
    const descendants = allUserTodos.filter(
      (t) => t.path.startsWith(`${todo.path}.`) || t.path === todo.path
    )

    descendants.forEach((descendant) => {
      if (descendant.id !== todo.id) {
        // Recalculate descendant path based on new parent path
        const oldBasePath = todo.path
        const newBasePath = updates.path!
        const relativePath = descendant.path.substring(oldBasePath.length)
        const newPath = `${newBasePath}${relativePath}`
        db.updateTodo(descendant.id, { path: newPath })
      }
    })
  })

  return { success: true, todos: getTodosByUser(userId) }
}
