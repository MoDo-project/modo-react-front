import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useTodos, apiTodosToUiTodos, todosToGoals, getAllGoalTodos } from '@/entities/todo'
import {
  useCreateTodoFeature,
  useUpdateTodoFeature,
  useDeleteTodoFeature,
  useToggleTodoFeature,
  useReorderTodosFeature,
} from '@/features/todo'
import TodoList from '@/pages/todos/components/TodoList'
import { GoalTabs } from '@/widgets/todo/goal-tabs'
import Header from '@/pages/todos/components/Header'
import AddTodoModal from '@/pages/todos/components/AddTodoModal'
import { AddGoalModal } from '@/features/goal/add-goal'
import { Goal, Todo as UiTodo } from '@/types'

export const TodosPage = () => {
  const isDark = useThemeStore(selectIsDark)

  const { data: apiTodos = [], isLoading } = useTodos()
  const { createTodo } = useCreateTodoFeature()
  const { updateTodo } = useUpdateTodoFeature()
  const { deleteTodo } = useDeleteTodoFeature()
  const { toggleTodo } = useToggleTodoFeature()
  const { reorderTodos } = useReorderTodosFeature()

  // API todos를 UI todos로 변환
  const todos = apiTodosToUiTodos(apiTodos)

  // parentId가 null인 todos를 Goals로 사용
  const goals = todosToGoals(todos)

  const [selectedGoalId, setSelectedGoalId] = useState<string>('all')
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [parentTodoId, setParentTodoId] = useState<string | null>(null)
  const [defaultGoalId, setDefaultGoalId] = useState<string | null>(null)

  // 선택된 Goal의 하위 todos만 필터링
  const filteredTodos =
    selectedGoalId === 'all'
      ? todos // 전체보기: 모든 todos 포함 (Goal 포함)
      : getAllGoalTodos(todos, selectedGoalId) // 특정 Goal의 모든 하위 todos

  // 디버깅을 위해 window에 노출
  if (typeof window !== 'undefined') {
    ;(window as any).DEBUG = {
      apiTodos,
      todos,
      goals,
      filteredTodos,
      selectedGoalId,
      isLoading,
    }
  }

  const selectedGoal = goals.find((g) => g.id === selectedGoalId)

  const handleAddSubtask = (parentId: string, goalId: string) => {
    setParentTodoId(parentId)
    setDefaultGoalId(goalId)
    setIsAddTodoOpen(true)
  }

  const handleAddTodo = (goalId: string, title: string) => {
    createTodo({
      goalId,
      title,
      parentTodoId,
      selectedGoalId,
      onSuccess: () => {
        setParentTodoId(null)
        setDefaultGoalId(null)
      },
    })
  }

  const handleToggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return
    toggleTodo(id, !todo.completed)
  }

  const handleCloseModal = () => {
    setIsAddTodoOpen(false)
    setParentTodoId(null)
    setDefaultGoalId(null)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setIsAddGoalOpen(true)
  }

  const handleSaveGoal = (title: string, color: string, icon: string) => {
    if (editingGoal) {
      // Goal 편집 = parentId가 null인 Todo 편집
      updateTodo(editingGoal.id, title)
      // TODO: color, icon도 업데이트 필요 (API에 필드 추가 필요)
    } else {
      // 새 Goal 생성 = parentId가 null인 Todo 생성
      createTodo({
        goalId: '',
        title,
        parentTodoId: null,
        selectedGoalId: 'all',
      })
    }
    setEditingGoal(null)
  }

  const handleDeleteGoal = (id: string) => {
    // Goal 삭제 = parentId가 null인 Todo 삭제 (하위 todos도 함께 삭제됨)
    deleteTodo(id)
  }

  const handleCloseGoalModal = () => {
    setIsAddGoalOpen(false)
    setEditingGoal(null)
  }

  const hasSelectedGoal = selectedGoalId !== 'all'

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-6">
          <div className={`py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className="text-sm">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-6">
        <GoalTabs
          goals={goals}
          selectedGoalId={selectedGoalId}
          onSelectGoal={setSelectedGoalId}
          onAddGoal={() => setIsAddGoalOpen(true)}
          onEditGoal={handleEditGoal}
          onDeleteGoal={handleDeleteGoal}
        />

        {hasSelectedGoal && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className={`flex items-center gap-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}
              >
                {selectedGoal && (
                  <i
                    className={`${selectedGoal.icon} flex h-5 w-5 items-center justify-center`}
                    style={{ color: selectedGoal.color }}
                  ></i>
                )}
                {selectedGoal?.title}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddTodoOpen(true)}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    isDark
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  <i className="ri-add-line mr-1"></i>
                  할일 추가
                </button>
              </div>
            </div>

            <TodoList
              todos={filteredTodos}
              goals={goals}
              onToggle={handleToggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onAddSubtask={handleAddSubtask}
              onReorder={reorderTodos}
              showGoalTags={false}
            />
          </div>
        )}

        {selectedGoalId === 'all' && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                전체보기
              </h2>
              <button
                onClick={() => {
                  setParentTodoId(null)
                  setDefaultGoalId(null)
                  setIsAddTodoOpen(true)
                }}
                className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isDark
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                <i className="ri-add-line mr-1"></i>
                할일 추가
              </button>
            </div>

            <TodoList
              todos={filteredTodos}
              goals={goals}
              onToggle={handleToggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
              onAddSubtask={handleAddSubtask}
              onReorder={reorderTodos}
              showGoalTags={true}
            />
          </div>
        )}
      </div>

      {isAddTodoOpen && (
        <AddTodoModal
          goals={goals}
          onClose={handleCloseModal}
          onAdd={handleAddTodo}
          defaultGoalId={defaultGoalId ?? (selectedGoalId !== 'all' ? selectedGoalId : undefined)}
          isSubtask={!!parentTodoId}
        />
      )}

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={handleCloseGoalModal}
        onAdd={handleSaveGoal}
        editingGoal={editingGoal}
      />
    </div>
  )
}
