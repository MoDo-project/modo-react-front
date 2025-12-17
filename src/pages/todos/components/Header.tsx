import { useThemeStore, selectIsDark, selectToggleTheme } from 'entities/theme'
import { useAuthStatus } from 'entities/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
  const { user } = useAuthStatus()
  const isDark = useThemeStore(selectIsDark)
  const toggleTheme = useThemeStore(selectToggleTheme)
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className={`border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>MODO</h1>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'
            }`}
          >
            <i
              className={`ri-menu-line flex h-5 w-5 items-center justify-center text-xl ${isDark ? 'text-white' : 'text-black'}`}
            ></i>
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div
                className={`absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg shadow-lg ${
                  isDark ? 'border border-zinc-800 bg-zinc-900' : 'border border-gray-200 bg-white'
                }`}
              >
                {user && (
                  <>
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setShowMenu(false)
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                        isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      <i className="ri-user-line flex h-5 w-5 items-center justify-center"></i>
                      프로필
                    </button>
                    <button
                      onClick={() => {
                        navigate('/groups')
                        setShowMenu(false)
                      }}
                      className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                        isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      <i className="ri-group-line flex h-5 w-5 items-center justify-center"></i>
                      그룹
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    navigate('/contact')
                    setShowMenu(false)
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    isDark ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-mail-line flex h-5 w-5 items-center justify-center"></i>
                  문의하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
