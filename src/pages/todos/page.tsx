import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useAuthStatus } from 'entities/auth'
import { useTodos } from '../../hooks/useTodos'
import TodoList from './components/TodoList'
import GoalTabs from './components/GoalTabs'
import Header from './components/Header'
import AddTodoModal from './components/AddTodoModal'
import { AddGoalModal } from 'features/goal/add-goal'
import { Goal } from '../../types'

export default function Todos() {
  const { user, isGuest } = useAuthStatus()
  const isDark = useThemeStore(selectIsDark)
  const {
    todos,
    goals,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    reorderTodos,
    addGoal,
    updateGoal,
    deleteGoal,
  } = useTodos()
  const [selectedGoalId, setSelectedGoalId] = useState<string>('all')
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [parentTodoId, setParentTodoId] = useState<string | undefined>(undefined)
  const [defaultGoalId, setDefaultGoalId] = useState<string | undefined>(undefined)

  const filteredTodos =
    selectedGoalId === 'all' ? todos : todos.filter((todo) => todo.goalId === selectedGoalId)

  const selectedGoal = goals.find((g) => g.id === selectedGoalId)

  const handleAddSubtask = (parentId: string, goalId: string) => {
    setParentTodoId(parentId)
    setDefaultGoalId(goalId)
    setIsAddTodoOpen(true)
  }

  const handleAddTodo = (goalId: string, title: string) => {
    addTodo(goalId, title, parentTodoId)
    setParentTodoId(undefined)
    setDefaultGoalId(undefined)
  }

  const handleCloseModal = () => {
    setIsAddTodoOpen(false)
    setParentTodoId(undefined)
    setDefaultGoalId(undefined)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setIsAddGoalOpen(true)
  }

  const handleSaveGoal = (title: string, color: string, icon: string) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, title, color, icon)
    } else {
      addGoal(title, color, icon)
    }
    setEditingGoal(null)
  }

  const handleCloseGoalModal = () => {
    setIsAddGoalOpen(false)
    setEditingGoal(null)
  }

  const hasSelectedGoal = selectedGoalId !== 'all'

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
          onDeleteGoal={deleteGoal}
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
              onToggle={toggleTodo}
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

            <TodoList
              todos={filteredTodos}
              goals={goals}
              onToggle={toggleTodo}
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
          defaultGoalId={defaultGoalId || (selectedGoalId !== 'all' ? selectedGoalId : undefined)}
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
