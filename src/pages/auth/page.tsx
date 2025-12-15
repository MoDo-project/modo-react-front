import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useThemeStore, selectIsDark } from 'entities/theme'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, signup, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const isDark = useThemeStore(selectIsDark)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
      navigate('/todos')
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  const handleGuestMode = () => {
    continueAsGuest()
    navigate('/todos')
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="https://public.readdy.ai/ai/img_res/52db04f4-c951-454e-b4be-80e9fd073997.png"
            alt="Logo"
            className="mx-auto mb-4 h-16 w-16"
          />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            To do list
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? '로그인하여 시작하세요' : '회원가입하여 시작하세요'}
          </p>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  이름
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-lg px-4 py-3 text-sm ${
                    isDark
                      ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                      : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                  } outline-none transition-colors`}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
            )}

            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                아이디
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full whitespace-nowrap rounded-lg py-3 text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-900'
              }`}
            >
              {isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGuestMode}
              className={`w-full whitespace-nowrap rounded-lg py-3 text-sm font-medium transition-colors ${
                isDark
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              게스트로 계속하기
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
