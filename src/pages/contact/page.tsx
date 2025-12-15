import { useState } from 'react'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
  const isDark = useThemeStore(selectIsDark)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.message.length > 500) {
      setSubmitMessage('메시지는 500자를 초과할 수 없습니다.')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    const submitData = new URLSearchParams()
    submitData.append('name', formData.name)
    submitData.append('email', formData.email)
    submitData.append('subject', formData.subject)
    submitData.append('message', formData.message)

    try {
      const response = await fetch('https://readdy.ai/api/form/d4vqn6enfc78pt9tml4g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: submitData.toString(),
      })

      if (response.ok) {
        setSubmitMessage('문의가 성공적으로 전송되었습니다!')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => {
          navigate('/todos')
        }, 2000)
      } else {
        setSubmitMessage('전송에 실패했습니다. 다시 시도해주세요.')
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
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>문의하기</h1>
          <div className="w-9"></div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className={`rounded-2xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <div className="mb-6">
            <h2 className={`mb-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
              무엇을 도와드릴까요?
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              궁금한 사항이나 문의사항을 남겨주세요. 빠르게 답변드리겠습니다.
            </p>
          </div>

          <form id="contact-form" data-readdy-form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                이름
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
                placeholder="홍길동"
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
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                제목
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
                placeholder="문의 제목을 입력하세요"
              />
            </div>

            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                메시지
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                maxLength={500}
                rows={6}
                className={`w-full resize-none rounded-lg px-4 py-3 text-sm ${
                  isDark
                    ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                    : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } outline-none transition-colors`}
                placeholder="문의 내용을 입력하세요 (최대 500자)"
              />
              <div
                className={`mt-1 text-right text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              >
                {formData.message.length}/500
              </div>
            </div>

            {submitMessage && (
              <div
                className={`rounded-lg py-2 text-center text-sm ${
                  submitMessage.includes('성공')
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
              {isSubmitting ? '전송 중...' : '문의하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
