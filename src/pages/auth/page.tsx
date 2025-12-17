import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useLogin, useSignupWithAutoLogin } from 'entities/auth'
import { authStorage } from '@/shared/api'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const isDark = useThemeStore(selectIsDark)

  const { mutate: login, isPending: isLoginPending } = useLogin()
  const { mutate: signupWithAutoLogin, isPending: isSignupPending } = useSignupWithAutoLogin()

  const isPending = isLoginPending || isSignupPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      login(
        { username, password },
        {
          onSuccess: () => {
            navigate('/todos')
          },
          onError: (error) => {
            console.error('Login error:', error)
          },
        }
      )
    } else {
      signupWithAutoLogin(
        {
          username,
          password,
          nickname,
          email,
        },
        {
          onSuccess: () => {
            navigate('/todos')
          },
          onError: (error) => {
            console.error('Signup error:', error)
          },
        }
      )
    }
  }

  const handleGuestMode = () => {
    authStorage.guest.set()
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
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>MODO</h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? '로그인하여 시작하세요' : '회원가입하여 시작하세요'}
          </p>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                아이디
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } transition-colors outline-none`}
                placeholder="아이디를 입력하세요"
                required
                disabled={isPending}
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
                } transition-colors outline-none`}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={isPending}
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    비밀번호 확인
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 text-sm ${
                      isDark
                        ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                        : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                    } transition-colors outline-none`}
                    placeholder="비밀번호를 입력하세요"
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 text-sm ${
                      isDark
                        ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                        : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                    } transition-colors outline-none`}
                    placeholder="이메일을 입력하세요"
                    required
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 text-sm ${
                      isDark
                        ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                        : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                    } transition-colors outline-none`}
                    placeholder="이메일을 입력하세요"
                    required
                    disabled={isPending}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={`w-full rounded-lg py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100 disabled:bg-gray-600'
                  : 'bg-black text-white hover:bg-gray-900 disabled:bg-gray-400'
              }`}
            >
              {isPending ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleGuestMode}
              disabled={isPending}
              className={`w-full rounded-lg py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isDark
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700 disabled:bg-zinc-900'
                  : 'bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-100'
              }`}
            >
              게스트로 계속하기
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={isPending}
              className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors disabled:opacity-50`}
            >
              {isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
