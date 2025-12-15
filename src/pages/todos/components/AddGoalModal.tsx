import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Goal } from '../../../types';

interface AddGoalModalProps {
  onClose: () => void;
  onAdd: (title: string, color: string, icon: string) => void;
  editingGoal?: Goal | null;
}

const COLORS = [
  { value: '#EF4444', name: '빨강' },
  { value: '#F59E0B', name: '주황' },
  { value: '#10B981', name: '초록' },
  { value: '#3B82F6', name: '파랑' },
  { value: '#8B5CF6', name: '보라' },
  { value: '#EC4899', name: '핑크' },
  { value: '#14B8A6', name: '청록' },
  { value: '#F97316', name: '오렌지' }
];

const ICONS = [
  { value: 'ri-user-line', name: '사용자' },
  { value: 'ri-team-line', name: '팀' },
  { value: 'ri-briefcase-line', name: '업무' },
  { value: 'ri-heart-line', name: '하트' },
  { value: 'ri-star-line', name: '별' },
  { value: 'ri-flag-line', name: '깃발' },
  { value: 'ri-trophy-line', name: '트로피' },
  { value: 'ri-rocket-line', name: '로켓' }
];

export default function AddGoalModal({ onClose, onAdd, editingGoal }: AddGoalModalProps) {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].value);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setSelectedColor(editingGoal.color);
      setSelectedIcon(editingGoal.icon);
    }
  }, [editingGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), selectedColor, selectedIcon);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'}`}>
            {editingGoal ? '목표 편집' : '새 목표'}
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i className={`ri-close-line text-xl w-5 h-5 flex items-center justify-center ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              목표 이름
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="목표 이름을 입력하세요"
              autoFocus
              className={`w-full px-4 py-3 rounded-lg border text-sm ${
                isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-black placeholder-gray-400'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              색상
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-12 rounded-lg transition-all cursor-pointer ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2'
                      : 'hover:scale-105'
                  } ${isDark ? 'ring-offset-zinc-900' : 'ring-offset-white'}`}
                  style={{
                    backgroundColor: color.value,
                    ringColor: color.value
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              아이콘
            </label>
            <div className="grid grid-cols-4 gap-3">
              {ICONS.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setSelectedIcon(icon.value)}
                  className={`h-12 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    selectedIcon === icon.value
                      ? isDark
                        ? 'bg-zinc-700 ring-2 ring-white'
                        : 'bg-gray-200 ring-2 ring-black'
                      : isDark
                      ? 'bg-zinc-800 hover:bg-zinc-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={icon.name}
                >
                  <i
                    className={`${icon.value} text-xl w-5 h-5 flex items-center justify-center`}
                    style={{ color: selectedColor }}
                  ></i>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                isDark
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                title.trim()
                  ? 'bg-black text-white hover:bg-gray-900'
                  : isDark
                  ? 'bg-zinc-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {editingGoal ? '저장' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
