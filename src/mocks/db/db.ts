import type { User } from '../schema/auth'
import type { Todo } from '../schema/todo'
import { generateId, hashPassword } from './utils'

/**
 * In-memory database
 */
class Database {
  private users: Map<number, User> = new Map()
  private todos: Map<number, Todo> = new Map()
  private usersByUsername: Map<string, User> = new Map()
  private todosByCreator: Map<number, number[]> = new Map()

  // User operations
  addUser(user: Omit<User, 'id'>): User {
    const id = generateId()
    const newUser: User = { ...user, id }
    this.users.set(id, newUser)
    this.usersByUsername.set(user.username, newUser)
    return newUser
  }

  getUserById(id: number): User | undefined {
    return this.users.get(id)
  }

  getUserByUsername(username: string): User | undefined {
    return this.usersByUsername.get(username)
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  updateUser(id: number, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (!user) return undefined

    const updatedUser = { ...user, ...updates }
    this.users.set(id, updatedUser)
    this.usersByUsername.set(updatedUser.username, updatedUser)
    return updatedUser
  }

  deleteUser(id: number): boolean {
    const user = this.users.get(id)
    if (!user) return false

    this.usersByUsername.delete(user.username)
    return this.users.delete(id)
  }

  // Todo operations
  addTodo(todo: Omit<Todo, 'id'>): Todo {
    const id = generateId()
    const newTodo: Todo = { ...todo, id }
    this.todos.set(id, newTodo)

    // Update creator's todo list
    const creatorTodos = this.todosByCreator.get(todo.creatorId) || []
    creatorTodos.push(id)
    this.todosByCreator.set(todo.creatorId, creatorTodos)

    return newTodo
  }

  getTodoById(id: number): Todo | undefined {
    return this.todos.get(id)
  }

  getTodosByCreatorId(creatorId: number): Todo[] {
    const todoIds = this.todosByCreator.get(creatorId) || []
    return todoIds.map((id) => this.todos.get(id)).filter((todo): todo is Todo => todo !== undefined)
  }

  getAllTodos(): Todo[] {
    return Array.from(this.todos.values())
  }

  updateTodo(id: number, updates: Partial<Todo>): Todo | undefined {
    const todo = this.todos.get(id)
    if (!todo) return undefined

    const updatedTodo = { ...todo, ...updates }
    this.todos.set(id, updatedTodo)
    return updatedTodo
  }

  deleteTodo(id: number): boolean {
    const todo = this.todos.get(id)
    if (!todo) return false

    // Remove from creator's todo list
    const creatorTodos = this.todosByCreator.get(todo.creatorId) || []
    const filtered = creatorTodos.filter((todoId) => todoId !== id)
    this.todosByCreator.set(todo.creatorId, filtered)

    return this.todos.delete(id)
  }

  // Reset database
  reset(): void {
    this.users.clear()
    this.todos.clear()
    this.usersByUsername.clear()
    this.todosByCreator.clear()
  }
}

export const db = new Database()

