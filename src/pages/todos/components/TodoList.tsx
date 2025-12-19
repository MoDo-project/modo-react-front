import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { Todo, Goal } from '../../../types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TodoListProps {
  todos: Todo[]
  goals: Goal[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string) => void
  onAddSubtask: (parentId: string, goalId: string) => void
  onReorder: (reorderedTodos: Todo[]) => void
  showGoalTags?: boolean
}

type DropPosition = 'before' | 'after' | 'inside' | null

interface RecursiveTodoItemProps {
  todo: Todo
  goal?: Goal
  depth: number
  todos: Todo[]
  goals: Goal[]
  isDark: boolean
  showGoalTags: boolean
  expandedIds: Set<string>
  editingId: string | null
  editText: string
  overId: string | null
  activeId: string | null
  dropPosition: DropPosition
  onToggleExpand: (id: string) => void
  onToggle: (id: string) => void
  onStartEdit: (todo: Todo) => void
  onSaveEdit: (id: string) => void
  onCancelEdit: () => void
  onEditTextChange: (text: string) => void
  onAddSubtask: (parentId: string, goalId: string) => void
  onDelete: (id: string) => void
  getSubtasks: (parentId: string) => Todo[]
  calculateProgress: (todoId: string) => number
}

// 재귀적으로 렌더링되는 통합 Todo 컴포넌트
function RecursiveTodoItem({
  todo,
  goal,
  depth,
  todos,
  goals,
  isDark,
  showGoalTags,
  expandedIds,
  editingId,
  editText,
  overId,
  activeId,
  dropPosition,
  onToggleExpand,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onAddSubtask,
  onDelete,
  getSubtasks,
  calculateProgress,
}: RecursiveTodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // 드래그 중일 때 원본은 약간 흐리게 표시
    opacity: isDragging ? 0.4 : 1,
  }

  const subtasks = getSubtasks(todo.id)
  const hasSubtasks = subtasks.length > 0
  const isExpanded = expandedIds.has(todo.id)
  const isEditing = editingId === todo.id
  const progress = calculateProgress(todo.id)

  const getProgressColor = () => {
    if (progress === 100) return '#10b981'
    if (progress > 0) return '#3b82f6'
    return isDark ? '#52525b' : '#d1d5db'
  }

  const isOver = overId === todo.id
  const isActive = activeId === todo.id
  const showBeforeIndicator = isOver && dropPosition === 'before'
  const showAfterIndicator = isOver && dropPosition === 'after'
  const showInsideIndicator = isOver && dropPosition === 'inside'

  return (
    <div ref={setNodeRef} style={style}>
      {/* 위쪽 드롭 인디케이터 (파란 드랍존) */}
      {showBeforeIndicator && (
        <div
          className="mb-1 h-2.5 rounded border-2 border-blue-500 bg-blue-500/30"
          style={{ marginLeft: depth > 0 ? `${depth * 24}px` : 0 }}
        />
      )}

      <div
        className={`flex items-center gap-3 rounded-lg p-3 transition-all ${
          isDark ? 'hover:bg-zinc-900' : 'hover:bg-gray-50'
        } ${showInsideIndicator ? 'bg-blue-500/10 ring-2 ring-blue-500' : ''}`}
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : 0 }}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex h-6 w-6 flex-shrink-0 cursor-grab items-center justify-center active:cursor-grabbing"
        >
          <i
            className={`ri-draggable flex h-5 w-5 items-center justify-center text-lg ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`}
          ></i>
        </div>

        {/* Checkbox or Progress Circle */}
        {hasSubtasks ? (
          // 자식이 있으면 완료 퍼센트 표시
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
            <svg className="h-10 w-10 -rotate-90 transform">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke={isDark ? '#27272a' : '#f3f4f6'}
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke={getProgressColor()}
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xs font-semibold ${
                  progress === 100
                    ? 'text-green-600'
                    : progress > 0
                      ? 'text-blue-600'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-600'
                }`}
              >
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          // 자식이 없으면 일반 체크박스
          <button
            onClick={() => onToggle(todo.id)}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-all ${
              todo.completed
                ? 'border-green-500 bg-green-500'
                : isDark
                  ? 'border-zinc-700 hover:border-zinc-600'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {todo.completed && (
              <i className="ri-check-line flex h-4 w-4 items-center justify-center text-sm text-white"></i>
            )}
          </button>
        )}

        {/* Expand/Collapse Arrow */}
        {hasSubtasks ? (
          <button
            onClick={() => onToggleExpand(todo.id)}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
          >
            <i
              className={`ri-arrow-right-s-line flex h-5 w-5 items-center justify-center text-lg ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
        ) : (
          <div className="w-5 flex-shrink-0"></div>
        )}

        {/* Title */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveEdit(todo.id)
                if (e.key === 'Escape') onCancelEdit()
              }}
              onBlur={() => onSaveEdit(todo.id)}
              autoFocus
              className={`w-full rounded border px-2 py-1 text-sm ${
                isDark
                  ? 'border-zinc-700 bg-zinc-900 text-white'
                  : 'border-gray-300 bg-white text-black'
              }`}
            />
          ) : (
            <span
              onClick={() => onStartEdit(todo)}
              className={`cursor-pointer text-sm ${
                todo.completed
                  ? isDark
                    ? 'text-gray-500 line-through'
                    : 'text-gray-400 line-through'
                  : isDark
                    ? 'text-white'
                    : 'text-black'
              }`}
            >
              {todo.title}
            </span>
          )}
        </div>

        {/* Goal Tag */}
        {showGoalTags && goal && (
          <div
            className="rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
          >
            {goal.title}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddSubtask(todo.id, todo.goalId)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
            title="하위 할일 추가"
          >
            <i
              className={`ri-add-line flex h-4 w-4 items-center justify-center text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-delete-bin-line flex h-4 w-4 items-center justify-center text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            ></i>
          </button>
        </div>
      </div>

      {/* Recursive Subtasks */}
      {isExpanded && hasSubtasks && (
        <div>
          {subtasks
            .sort((a, b) => a.order - b.order)
            .map((subtask) => {
              const subtaskGoal = goals.find((g) => g.id === subtask.goalId)
              return (
                <RecursiveTodoItem
                  key={subtask.id}
                  todo={subtask}
                  goal={subtaskGoal}
                  depth={depth + 1}
                  todos={todos}
                  goals={goals}
                  isDark={isDark}
                  showGoalTags={showGoalTags}
                  expandedIds={expandedIds}
                  editingId={editingId}
                  editText={editText}
                  overId={overId}
                  activeId={activeId}
                  dropPosition={dropPosition}
                  onToggleExpand={onToggleExpand}
                  onToggle={onToggle}
                  onStartEdit={onStartEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onEditTextChange={onEditTextChange}
                  onAddSubtask={onAddSubtask}
                  onDelete={onDelete}
                  getSubtasks={getSubtasks}
                  calculateProgress={calculateProgress}
                />
              )
            })}
        </div>
      )}

      {/* 아래쪽 드롭 인디케이터 (파란 드랍존) */}
      {showAfterIndicator && (
        <div
          className="mt-1 h-2.5 rounded border-2 border-blue-500 bg-blue-500/30"
          style={{ marginLeft: depth > 0 ? `${depth * 24}px` : 0 }}
        />
      )}
    </div>
  )
}

// DragOverlay에서 사용할 간단한 표시용 컴포넌트
interface TodoOverlayItemProps {
  todo: Todo
  goal?: Goal
  isDark: boolean
  showGoalTags: boolean
  hasSubtasks: boolean
  progress: number
}

function TodoOverlayItem({
  todo,
  goal,
  isDark,
  showGoalTags,
  hasSubtasks,
  progress,
}: TodoOverlayItemProps) {
  const getProgressColor = () => {
    if (progress === 100) return '#10b981'
    if (progress > 0) return '#3b82f6'
    return isDark ? '#52525b' : '#d1d5db'
  }

  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 shadow-2xl ${
        isDark ? 'border border-zinc-700 bg-zinc-800' : 'border border-gray-200 bg-white'
      }`}
      style={{ opacity: 0.6 }}
    >
      {/* Drag Handle */}
      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
        <i
          className={`ri-draggable flex h-5 w-5 items-center justify-center text-lg ${
            isDark ? 'text-gray-600' : 'text-gray-400'
          }`}
        ></i>
      </div>

      {/* Checkbox or Progress Circle */}
      {hasSubtasks ? (
        <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
          <svg className="h-10 w-10 -rotate-90 transform">
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke={isDark ? '#27272a' : '#f3f4f6'}
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke={getProgressColor()}
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-xs font-semibold ${
                progress === 100
                  ? 'text-green-600'
                  : progress > 0
                    ? 'text-blue-600'
                    : isDark
                      ? 'text-gray-400'
                      : 'text-gray-600'
              }`}
            >
              {progress}%
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
            todo.completed
              ? 'border-green-500 bg-green-500'
              : isDark
                ? 'border-zinc-700'
                : 'border-gray-300'
          }`}
        >
          {todo.completed && (
            <i className="ri-check-line flex h-4 w-4 items-center justify-center text-sm text-white"></i>
          )}
        </div>
      )}

      {/* Expand Arrow Spacer */}
      {hasSubtasks ? (
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
          <i
            className={`ri-arrow-right-s-line flex h-5 w-5 items-center justify-center text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          ></i>
        </div>
      ) : (
        <div className="w-5 flex-shrink-0"></div>
      )}

      {/* Title */}
      <div className="min-w-0 flex-1">
        <span
          className={`text-sm ${
            todo.completed
              ? isDark
                ? 'text-gray-500 line-through'
                : 'text-gray-400 line-through'
              : isDark
                ? 'text-white'
                : 'text-black'
          }`}
        >
          {todo.title}
        </span>
      </div>

      {/* Goal Tag */}
      {showGoalTags && goal && (
        <div
          className="rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap"
          style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
        >
          {goal.title}
        </div>
      )}

      {/* Action Buttons Spacer */}
      <div className="flex items-center gap-1">
        <div className="h-7 w-7"></div>
        <div className="h-7 w-7"></div>
      </div>
    </div>
  )
}

export default function TodoList({
  todos,
  goals,
  onToggle,
  onDelete,
  onUpdate,
  onAddSubtask,
  onReorder,
  showGoalTags = true,
}: TodoListProps) {
  const isDark = useThemeStore(selectIsDark)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [dropPosition, setDropPosition] = useState<DropPosition>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onUpdate(id, editText.trim())
    }
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const getSubtasks = (parentId: string): Todo[] => {
    return todos.filter((t) => t.parentId === parentId).sort((a, b) => a.order - b.order)
  }

  const calculateProgress = (todoId: string): number => {
    const subtasks = getSubtasks(todoId)
    if (subtasks.length === 0) return 0

    const completedCount = subtasks.filter((t) => t.completed).length
    return Math.round((completedCount / subtasks.length) * 100)
  }

  const getAllTodoIds = (todos: Todo[]): string[] => {
    const ids: string[] = []
    const addIds = (todoList: Todo[]) => {
      todoList.forEach((todo) => {
        ids.push(todo.id)
        const subtasks = getSubtasks(todo.id)
        if (subtasks.length > 0) {
          addIds(subtasks)
        }
      })
    }
    addIds(todos)
    return ids
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over, delta } = event

    if (!over) {
      setOverId(null)
      setDropPosition(null)
      return
    }

    setOverId(over.id as string)

    // over 요소의 rect 정보 가져오기
    const overRect = over.rect

    if (!overRect) {
      setDropPosition(null)
      return
    }

    // 마우스가 요소의 어느 위치에 있는지 계산
    const overMiddleY = overRect.top + overRect.height / 2
    const pointerY = overRect.top + delta.y

    // 요소 높이의 25% 기준으로 위치 결정
    const threshold = overRect.height * 0.25

    if (pointerY < overRect.top + threshold) {
      // 상단 25% 영역 - 위에 삽입
      setDropPosition('before')
    } else if (pointerY > overRect.bottom - threshold) {
      // 하단 25% 영역 - 아래에 삽입
      setDropPosition('after')
    } else {
      // 중앙 50% 영역 - 자식으로 추가
      setDropPosition('inside')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    setActiveId(null)
    setOverId(null)
    const currentDropPosition = dropPosition
    setDropPosition(null)

    if (!over || active.id === over.id) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const activeTodo = todos.find((t) => t.id === activeId)
    const overTodo = todos.find((t) => t.id === overId)

    if (!activeTodo || !overTodo) return

    // 자기 자신의 자식으로는 이동 불가
    const isDescendant = (parentId: string, childId: string): boolean => {
      const children = todos.filter((t) => t.parentId === parentId)
      if (children.some((c) => c.id === childId)) return true
      return children.some((c) => isDescendant(c.id, childId))
    }

    if (isDescendant(activeId, overId)) {
      return
    }

    let updatedTodos: Todo[] = []

    if (currentDropPosition === 'inside') {
      // 자식으로 추가
      const overSubtasks = todos.filter((t) => t.parentId === overId)
      const maxOrder = overSubtasks.reduce((max, t) => Math.max(max, t.order), -1)

      const updatedActiveTodo = {
        ...activeTodo,
        parentId: overId,
        order: maxOrder + 1,
      }

      updatedTodos = todos.map((t) => (t.id === activeId ? updatedActiveTodo : t))

      // 자동으로 확장
      setExpandedIds((prev) => new Set([...prev, overId]))
    } else if (currentDropPosition === 'before' || currentDropPosition === 'after') {
      // 같은 레벨에서 위 또는 아래에 삽입
      const targetParentId = overTodo.parentId
      const siblings = todos.filter((t) => t.parentId === targetParentId)
      const sortedSiblings = siblings.sort((a, b) => a.order - b.order)

      // activeTodo를 새로운 부모로 이동
      const updatedActiveTodo = {
        ...activeTodo,
        parentId: targetParentId,
      }

      // activeTodo를 siblings에서 제거하고 새 위치에 삽입
      const filteredSiblings = sortedSiblings.filter((t) => t.id !== activeId)
      const overIndex = filteredSiblings.findIndex((t) => t.id === overId)

      if (overIndex === -1) return

      const insertIndex = currentDropPosition === 'before' ? overIndex : overIndex + 1
      filteredSiblings.splice(insertIndex, 0, updatedActiveTodo)

      // order 값 업데이트
      const updatedSiblings = filteredSiblings.map((item, index) => ({
        ...item,
        order: index,
      }))

      // 전체 todos 배열에서 업데이트
      updatedTodos = todos.map((todo) => {
        const updated = updatedSiblings.find((s) => s.id === todo.id)
        return updated || todo
      })
    } else {
      return
    }

    onReorder(updatedTodos)
  }

  // 전달받은 todos 배열 내에서만 부모-자식 관계를 확인하여 최상위 항목 찾기
  // parentId가 null이거나, parentId가 전달받은 todos 배열에 없는 항목들을 최상위로 간주
  const todoIdsSet = new Set(todos.map((t) => t.id))
  const topLevelTodos = todos
    .filter((t) => {
      // parentId가 null이면 최상위
      if (t.parentId === null) return true
      // parentId가 전달받은 todos 배열에 없으면 최상위 (필터링된 배열의 최상위)
      return !todoIdsSet.has(t.parentId)
    })
    .sort((a, b) => a.order - b.order)
  const allTodoIds = getAllTodoIds(topLevelTodos)

  if (topLevelTodos.length === 0) {
    return (
      <div className={`py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        <i className="ri-checkbox-blank-circle-line mx-auto mb-3 flex h-10 w-10 items-center justify-center text-4xl"></i>
        <p className="text-sm">할일이 없습니다</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allTodoIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {topLevelTodos.map((todo) => {
            const goal = goals.find((g) => g.id === todo.goalId)
            return (
              <RecursiveTodoItem
                key={todo.id}
                todo={todo}
                goal={goal}
                depth={0}
                todos={todos}
                goals={goals}
                isDark={isDark}
                showGoalTags={showGoalTags}
                expandedIds={expandedIds}
                editingId={editingId}
                editText={editText}
                overId={overId}
                activeId={activeId}
                dropPosition={dropPosition}
                onToggleExpand={toggleExpand}
                onToggle={onToggle}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditTextChange={setEditText}
                onAddSubtask={onAddSubtask}
                onDelete={onDelete}
                getSubtasks={getSubtasks}
                calculateProgress={calculateProgress}
              />
            )
          })}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId
          ? (() => {
              const activeTodo = todos.find((t) => t.id === activeId)
              if (!activeTodo) return null

              const goal = goals.find((g) => g.id === activeTodo.goalId)
              const subtasks = getSubtasks(activeTodo.id)
              const hasSubtasks = subtasks.length > 0
              const progress = calculateProgress(activeTodo.id)

              return (
                <TodoOverlayItem
                  todo={activeTodo}
                  goal={goal}
                  isDark={isDark}
                  showGoalTags={showGoalTags}
                  hasSubtasks={hasSubtasks}
                  progress={progress}
                />
              )
            })()
          : null}
      </DragOverlay>
    </DndContext>
  )
}
