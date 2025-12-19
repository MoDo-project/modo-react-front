export type Todo = {
  id: number
  title: string
  description: string
  creatorId: number
  isCompleted: boolean
  createdAt: Date
  deadline: Date
  parentId: number | null
  path: string
  orderNumber: number
}

export type CreateTodoRequest = Pick<Todo, 'title' | 'description' | 'deadline' | 'parentId'>

export type CreateTodoResponse = Todo[]

export type UpdateTodoRequest = Partial<Pick<Todo, 'title' | 'description' | 'isCompleted' | 'deadline' | 'parentId' | 'orderNumber'>>

export type UpdateTodoResponse = Todo[]

