import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()
  const isDark = useThemeStore(selectIsDark)
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    const formData = new URLSearchParams()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('userId', user?.id || '')

    try {
      const response = await fetch('https://readdy.ai/api/form/d4vqn6enfc78pt9tml40', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      if (response.ok) {
        setSubmitMessage('저장되었습니다!')
        const updatedUser = { ...user!, name, email }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setTimeout(() => {
          navigate('/todos')
        }, 1500)
      } else {
        setSubmitMessage('저장에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      setSubmitMessage('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>프로필</h1>
          <div className="w-9"></div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-500 text-3xl font-bold text-white">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <form id="profile-form" data-readdy-form onSubmit={handleSave} className="space-y-4">
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                이름
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
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
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
              />
            </div>

            <input type="hidden" name="userId" value={user?.id || ''} />

            {submitMessage && (
              <div
                className={`rounded-lg py-2 text-center text-sm ${
                  submitMessage.includes('성공') || submitMessage.includes('저장되었습니다')
                    ? isDark
                      ? 'text-green-400'
                      : 'text-green-600'
                    : isDark
                      ? 'text-red-400'
                      : 'text-red-600'
                }`}
              >
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full whitespace-nowrap rounded-lg py-3 text-sm font-medium transition-colors ${
                isSubmitting ? 'cursor-not-allowed opacity-50' : ''
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
                logout()
                navigate('/')
              }}
              className={`w-full whitespace-nowrap rounded-lg py-3 text-sm font-medium transition-colors ${
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
  )
}
