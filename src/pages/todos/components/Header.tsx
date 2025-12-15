import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className={`border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
          Todo
        </h1>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i className={`ri-menu-line text-xl w-5 h-5 flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}></i>
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-20 overflow-hidden ${
                isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200'
              }`}>
                {user && (
                  <>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                        isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      <i className="ri-user-line w-5 h-5 flex items-center justify-center"></i>
                      프로필
                    </button>
                    <button
                      onClick={() => {
                        navigate('/groups');
                        setShowMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                        isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      <i className="ri-group-line w-5 h-5 flex items-center justify-center"></i>
                      그룹
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    navigate('/contact');
                    setShowMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                    isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-mail-line w-5 h-5 flex items-center justify-center"></i>
                  문의하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
