export interface Todo {
  id: string
  goalId: string
  title: string
  completed: boolean
  createdAt: Date
  parentId: string | null // Goal은 null, 하위 todo는 부모 ID
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
