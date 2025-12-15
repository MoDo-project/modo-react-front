import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../../hooks/useTodos';
import { StudyGroup } from '../../types';

export default function Groups() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { goals } = useTodos();
  const [groups, setGroups] = useState<StudyGroup[]>(() => {
    const saved = localStorage.getItem('studyGroups');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudyGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id || '');
  const [selectedColor, setSelectedColor] = useState('#EF4444');

  const colors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedGoalId && user) {
      const newGroup: StudyGroup = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        goalId: selectedGoalId,
        members: [user.id],
        createdBy: user.id,
        createdAt: new Date(),
        color: selectedColor
      };
      const updatedGroups = [...groups, newGroup];
      setGroups(updatedGroups);
      localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
      setIsCreateModalOpen(false);
      setNewGroupName('');
      setSelectedColor('#EF4444');
    }
  };

  const handleEditGroup = () => {
    if (editingGroup && newGroupName.trim()) {
      const updatedGroups = groups.map(g => 
        g.id === editingGroup.id 
          ? { ...g, name: newGroupName.trim(), goalId: selectedGoalId, color: selectedColor }
          : g
      );
      setGroups(updatedGroups);
      localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
      setIsEditModalOpen(false);
      setEditingGroup(null);
      setNewGroupName('');
      setSelectedColor('#EF4444');
    }
  };

  const openEditModal = (group: StudyGroup) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setSelectedGoalId(group.goalId);
    setSelectedColor(group.color || '#EF4444');
    setIsEditModalOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter(g => g.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem('studyGroups', JSON.stringify(updatedGroups));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'}`}>
      <header className={`border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/todos')}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i className={`ri-arrow-left-line text-lg w-5 h-5 flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}></i>
          </button>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            그룹
          </h1>
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setNewGroupName('');
              setSelectedGoalId(goals[0]?.id || '');
              setSelectedColor('#EF4444');
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i className={`ri-add-line text-lg w-5 h-5 flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}></i>
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {groups.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <i className="ri-team-line text-4xl mb-2 w-10 h-10 flex items-center justify-center mx-auto"></i>
            <p className="text-sm">그룹이 없습니다</p>
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setNewGroupName('');
                setSelectedGoalId(goals[0]?.id || '');
                setSelectedColor('#EF4444');
              }}
              className={`mt-4 px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
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
              const goal = goals.find(g => g.id === group.goalId);
              const groupColor = group.color || goal?.color || '#EF4444';
              return (
                <div
                  key={group.id}
                  className={`rounded-2xl p-4 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: groupColor + '20' }}
                      >
                        <i className={`${goal?.icon || 'ri-team-line'} text-xl w-6 h-6 flex items-center justify-center`} style={{ color: groupColor }}></i>
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
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'
                        }`}
                      >
                        <i className={`ri-edit-line text-base w-4 h-4 flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}></i>
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'
                        }`}
                      >
                        <i className={`ri-delete-bin-line text-base w-4 h-4 flex items-center justify-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 그룹 만들기 모달 */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                그룹 만들기
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
                }`}
              >
                <i className={`ri-close-line text-xl w-5 h-5 flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  그룹 이름
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm ${
                    isDark
                      ? 'bg-black text-white border border-zinc-800 focus:border-zinc-700'
                      : 'bg-gray-50 text-black border border-gray-200 focus:border-gray-300'
                  } outline-none transition-colors`}
                  placeholder="그룹 이름을 입력하세요"
                  autoFocus
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  색상 선택
                </label>
                <div className="flex items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-all cursor-pointer ${
                        selectedColor === color ? 'ring-2 ring-offset-2' : ''
                      } ${isDark ? 'ring-offset-zinc-900' : 'ring-offset-white'}`}
                      style={{ 
                        backgroundColor: color,
                        ringColor: color
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  목표 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoalId(goal.id)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                        selectedGoalId === goal.id
                          ? isDark
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                          : isDark
                            ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <i className={`${goal.icon} w-4 h-4 flex items-center justify-center`} style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}></i>
                      {goal.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
                className={`w-full py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  newGroupName.trim()
                    ? isDark
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                    : isDark
                      ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsEditModalOpen(false)}>
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                그룹 편집
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
                }`}
              >
                <i className={`ri-close-line text-xl w-5 h-5 flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  그룹 이름
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm ${
                    isDark
                      ? 'bg-black text-white border border-zinc-800 focus:border-zinc-700'
                      : 'bg-gray-50 text-black border border-gray-200 focus:border-gray-300'
                  } outline-none transition-colors`}
                  placeholder="그룹 이름을 입력하세요"
                  autoFocus
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  색상 선택
                </label>
                <div className="flex items-center gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-all cursor-pointer ${
                        selectedColor === color ? 'ring-2 ring-offset-2' : ''
                      } ${isDark ? 'ring-offset-zinc-900' : 'ring-offset-white'}`}
                      style={{ 
                        backgroundColor: color,
                        ringColor: color
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  목표 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setSelectedGoalId(goal.id)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                        selectedGoalId === goal.id
                          ? isDark
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                          : isDark
                            ? 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <i className={`${goal.icon} w-4 h-4 flex items-center justify-center`} style={{ color: selectedGoalId === goal.id ? goal.color : undefined }}></i>
                      {goal.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleEditGroup}
                disabled={!newGroupName.trim()}
                className={`w-full py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  newGroupName.trim()
                    ? isDark
                      ? 'bg-white text-black hover:bg-gray-100'
                      : 'bg-black text-white hover:bg-gray-900'
                    : isDark
                      ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
