import { db } from './db'
import type { User } from '../schema/auth'
import type { Todo } from '../schema/todo'

const STORAGE_KEY = 'msw-db-state'

interface DbState {
  users: User[]
  todos: Todo[]
}

/**
 * Save database state to localStorage
 */
export const saveToLocalStorage = (): void => {
  try {
    const state: DbState = {
      users: db.getAllUsers(),
      todos: db.getAllTodos(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save database state:', error)
  }
}

/**
 * Load database state from localStorage
 */
export const loadFromLocalStorage = (): void => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    const state: DbState = JSON.parse(saved)

    // Restore users
    state.users.forEach((user) => {
      db.addUser(user)
    })

    // Restore todos
    state.todos.forEach((todo) => {
      db.addTodo(todo)
    })
  } catch (error) {
    console.error('Failed to load database state:', error)
  }
}

/**
 * Clear localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear database state:', error)
  }
}

