
import { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Goal } from '../../../types';

interface AddTodoModalProps {
  goals: Goal[];
  onClose: () => void;
  onAdd: (goalId: string, title: string) => void;
  defaultGoalId?: string;
  isSubtask?: boolean;
}

export default function AddTodoModal({ goals, onClose, onAdd, defaultGoalId, isSubtask }: AddTodoModalProps) {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState(defaultGoalId || goals[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && selectedGoalId) {
      onAdd(selectedGoalId, title.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {isSubtask ? '하위 할일 추가' : '할일 추가'}
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i className={`ri-close-line text-xl w-5 h-5 flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              할일 내용
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg text-sm ${
                isDark
                  ? 'bg-black text-white border border-zinc-800 focus:border-zinc-700'
                  : 'bg-gray-50 text-black border border-gray-200 focus:border-gray-300'
              } outline-none transition-colors`}
              placeholder="할일을 입력하세요"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className={`w-full py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
              title.trim()
                ? isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-900'
                : isDark
                  ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            추가하기
          </button>
        </form>
      </div>
    </div>
  );
}
