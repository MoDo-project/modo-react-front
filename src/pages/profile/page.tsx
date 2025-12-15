import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('userId', user?.id || '');

    try {
      const response = await fetch('https://readdy.ai/api/form/d4vqn6enfc78pt9tml40', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (response.ok) {
        setSubmitMessage('저장되었습니다!');
        const updatedUser = { ...user!, name, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setTimeout(() => {
          navigate('/todos');
        }, 1500);
      } else {
        setSubmitMessage('저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setSubmitMessage('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
            프로필
          </h1>
          <div className="w-9"></div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <form id="profile-form" data-readdy-form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                이름
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg text-sm ${
                  isDark
                    ? 'bg-black text-white border border-zinc-800 focus:border-zinc-700'
                    : 'bg-white text-black border border-gray-200 focus:border-gray-300'
                } outline-none transition-colors`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-lg text-sm ${
                  isDark
                    ? 'bg-black text-white border border-zinc-800 focus:border-zinc-700'
                    : 'bg-white text-black border border-gray-200 focus:border-gray-300'
                } outline-none transition-colors`}
              />
            </div>

            <input type="hidden" name="userId" value={user?.id || ''} />

            {submitMessage && (
              <div className={`text-center text-sm py-2 rounded-lg ${
                submitMessage.includes('성공') || submitMessage.includes('저장되었습니다')
                  ? isDark ? 'text-green-400' : 'text-green-600'
                  : isDark ? 'text-red-400' : 'text-red-600'
              }`}>
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className={`w-full py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                isDark
                  ? 'bg-zinc-800 text-red-400 hover:bg-zinc-700'
                  : 'bg-gray-200 text-red-600 hover:bg-gray-300'
              }`}
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
