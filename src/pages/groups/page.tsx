import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useAuthStatus } from 'entities/auth'
import { useNavigate } from 'react-router-dom'
import { useTodos, apiTodosToUiTodos, todosToGoals } from '@/entities/todo'
import { StudyGroup } from '../../types'

export const GroupsPage = () => {
  const { user } = useAuthStatus()
  const isDark = useThemeStore(selectIsDark)
  const navigate = useNavigate()

  const { data: apiTodos = [] } = useTodos()
  const todos = apiTodosToUiTodos(apiTodos)
  const goals = todosToGoals(todos)
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('studyGroups')
    return saved ? JSON.parse(saved) : []
  })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null)
  const [newGroupName, setNewGroupName] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || '')
  const [selectedColor, setSelectedColor] = useState('#EF4444')

  const colors = [
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
    '#F97316',
  ]

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedGoalId && user) {
      const newGroup: StudyGroup = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        goalId: selectedGoalId,
        members: [user.id],
        createdBy: user.id,
        createdAt: new Date(),
        color: selectedColor,
      }
      const updatedGroups = [...groups, newGroup]
      setGroups(updatedGroups)
      localStorage.setItem('studyGroups', JSON.stringify(updatedGroups))
      setIsCreateModalOpen(false)
      setNewGroupName('')
      setSelectedColor('#EF4444')
    }
  }

  const handleEditGroup = () => {
    if (editingGroup && newGroupName.trim()) {
      const updatedGroups = groups.map((g) =>
        g.id === editingGroup.id
          ? { ...g, name: newGroupName.trim(), goalId: selectedGoalId, color: selectedColor }
          : g
      )
      setGroups(updatedGroups)
      localStorage.setItem('studyGroups', JSON.stringify(updatedGroups))
      setIsEditModalOpen(false)
      setEditingGroup(null)
      setNewGroupName('')
      setSelectedColor('#EF4444')
    }
  }

  const openEditModal = (group: StudyGroup) => {
    setEditingGroup(group)
    setNewGroupName(group.name)
    setSelectedGoalId(group.goalId)
    setSelectedColor(group.color || '#EF4444')
    setIsEditModalOpen(true)
  }

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter((g) => g.id !== groupId)
    setGroups(updatedGroups)
    localStorage.setItem('studyGroups', JSON.stringify(updatedGroups))
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <header className={`border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <button
            onClick={() => navigate('/todos')}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-arrow-left-line flex h-5 w-5 items-center justify-center text-lg ${isDark ? 'text-white' : 'text-black'}`}
            ></i>
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>그룹</h1>
          <button
            onClick={() => {
              setIsCreateModalOpen(true)
              setNewGroupName('')
              setSelectedGoalId(goals[0]?.id || '')
              setSelectedColor('#EF4444')
            }}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-add-line flex h-5 w-5 items-center justify-center text-lg ${isDark ? 'text-white' : 'text-black'}`}
            ></i>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {groups.length === 0 ? (
          <div className={`py-12 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <i className="ri-team-line mx-auto mb-2 flex h-10 w-10 items-center justify-center text-4xl"></i>
            <p className="text-sm">그룹이 없습니다</p>
            <button
              onClick={() => {
                setIsCreateModalOpen(true)
                setNewGroupName('')
                setSelectedGoalId(goals[0]?.id || '')
                setSelectedColor('#EF4444')
              }}
              className={`mt-4 rounded-lg px-6 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              그룹 만들기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => {
              const goal = goals.find((g) => g.id === group.goalId)
              const groupColor = group.color || goal?.color || '#EF4444'
              return (
                <div
                  key={group.id}
                  className={`rounded-2xl p-4 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full"
                        style={{ backgroundColor: groupColor + '20' }}
                      >
                        <i
                          className={`${goal?.icon || 'ri-team-line'} flex h-6 w-6 items-center justify-center text-xl`}
                          style={{ color: groupColor }}
                        ></i>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
                          {group.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {goal?.title} · {group.members.length}명
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(group)}
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                          isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'
                        }`}
                      >
                        <i
                          className={`ri-edit-line flex h-4 w-4 items-center justify-center text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        ></i>
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                          isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'
                        }`}
                      >
                        <i
                          className={`ri-delete-bin-line flex h-4 w-4 items-center justify-center text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 그룹 만들기 모달 */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                그룹 만들기
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
                }`}
              >
                <i
                  className={`ri-close-line flex h-5 w-5 items-center justify-center text-xl ${isDark ? 'text-white' : 'text-black'}`}
                ></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  그룹 이름
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 text-sm ${
                    isDark
                      ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                      : 'border border-gray-200 bg-gray-50 text-black focus:border-gray-300'
                  } transition-colors outline-none`}
                  placeholder="그룹 이름을 입력하세요"
                  autoFocus
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  색상 선택
                </label>
                <div className="flex items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 cursor-pointer rounded-full transition-all ${
                        selectedColor === color ? 'ring-2 ring-offset-2' : ''
                      } ${isDark ? 'ring-offset-zinc-900' : 'ring-offset-white'}`}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  목표 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoalId(goal.id)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedGoalId === goal.id
                          ? isDark
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                          : isDark
                            ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <i
                        className={`${goal.icon} flex h-4 w-4 items-center justify-center`}
                        style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}
                      ></i>
                      {goal.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
                className={`w-full rounded-lg py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  newGroupName.trim()
                    ? isDark
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                    : isDark
                      ? 'cursor-not-allowed bg-zinc-800 text-gray-600'
                      : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 그룹 편집 모달 */}
      {isEditModalOpen && editingGroup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                그룹 편집
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
                }`}
              >
                <i
                  className={`ri-close-line flex h-5 w-5 items-center justify-center text-xl ${isDark ? 'text-white' : 'text-black'}`}
                ></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  그룹 이름
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 text-sm ${
                    isDark
                      ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                      : 'border border-gray-200 bg-gray-50 text-black focus:border-gray-300'
                  } transition-colors outline-none`}
                  placeholder="그룹 이름을 입력하세요"
                  autoFocus
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  색상 선택
                </label>
                <div className="flex items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-10 w-10 cursor-pointer rounded-full transition-all ${
                        selectedColor === color ? 'ring-2 ring-offset-2' : ''
                      } ${isDark ? 'ring-offset-zinc-900' : 'ring-offset-white'}`}
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  목표 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoalId(goal.id)}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedGoalId === goal.id
                          ? isDark
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                          : isDark
                            ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <i
                        className={`${goal.icon} flex h-4 w-4 items-center justify-center`}
                        style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}
                      ></i>
                      {goal.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEditGroup}
                disabled={!newGroupName.trim()}
                className={`w-full rounded-lg py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  newGroupName.trim()
                    ? isDark
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                    : isDark
                      ? 'cursor-not-allowed bg-zinc-800 text-gray-600'
                      : 'cursor-not-allowed bg-gray-200 text-gray-400'
                }`}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
