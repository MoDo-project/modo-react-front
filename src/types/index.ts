export interface Todo {
  id: string
  goalId: string
  title: string
  completed: boolean
  createdAt: Date
  parentId: string | null // null일 경우 Goal, 하위 todo는 부모 ID
  order: number
}

// ui Goal용
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
