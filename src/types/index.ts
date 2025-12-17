export interface Todo {
  id: string
  goalId: string
  title: string
  completed: boolean
  createdAt: Date
  parentId?: string
  order: number
}

export interface Goal {
  id: string
  title: string
  color: string
  icon: string
}

export interface StudyGroup {
  id: string
  name: string
  goalId: string
  members: string[]
  createdBy: string
  createdAt: Date
  color?: string
}
