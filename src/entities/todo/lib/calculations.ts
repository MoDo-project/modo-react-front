import { Todo } from '@/types'

/**
 * 순수 함수: 하위 할일 진행률 계산
 */
export const calculateProgress = (todos: Todo[], parentId: string): number => {
  const subtasks = todos.filter((t) => t.parentId === parentId)
  if (subtasks.length === 0) return 0

  const completed = subtasks.filter((t) => t.completed).length
  return Math.round((completed / subtasks.length) * 100)
}

/**
 * 순수 함수: 진행률에 따른 색상 반환
 */
export const getProgressColor = (progress: number): string => {
  if (progress === 100) return '#10b981'
  if (progress > 0) return '#3b82f6'
  return '#d1d5db'
}
