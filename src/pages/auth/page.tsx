import { useTranslation } from 'react-i18next'
import { useThemeStore, selectIsDark } from 'entities/theme'
import { useAuthForm } from 'entities/auth'
import { useLanguageToggle } from '@/shared/lib/i18n'

export const AuthPage = () => {
  const { t } = useTranslation()
  const isDark = useThemeStore(selectIsDark)
  const { toggleLanguage, currentLanguage } = useLanguageToggle()

  const {
    isLogin,
    username,
    email,
    nickname,
    password,
    confirmPassword,
    isPending,
    errors,
    isFormValid,
    setUsername,
    setEmail,
    setNickname,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    handleGuestMode,
    toggleMode,
  } = useAuthForm()

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 ${isDark ? 'bg-black' : 'bg-white'}`}
    >
      <div className="w-full max-w-md">
        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleLanguage}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isDark
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            {currentLanguage === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
          </button>
        </div>

        <div className="mb-8 text-center">
          <img
            src="https://public.readdy.ai/ai/img_res/52db04f4-c951-454e-b4be-80e9fd073997.png"
            alt="Logo"
            className="mx-auto mb-4 h-16 w-16"
          />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
            {t('auth.title')}
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? t('auth.login.title') : t('auth.signup.title')}
          </p>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('auth.form.username')}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  errors.username
                    ? 'border-2 border-red-500'
                    : isDark
                      ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                      : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors outline-none`}
                placeholder={t('auth.form.usernamePlaceholder')}
                disabled={isPending}
              />
              {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label
                className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {t('auth.form.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-lg px-4 py-3 text-sm ${
                  errors.password
                    ? 'border-2 border-red-500'
                    : isDark
                      ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                      : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                } ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors outline-none`}
                placeholder={t('auth.form.passwordPlaceholder')}
                disabled={isPending}
              />
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            {!isLogin && (
              <>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('auth.form.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 text-sm ${
                      errors.confirmPassword
                        ? 'border-2 border-red-500'
                        : isDark
                          ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                          : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                    } ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors outline-none`}
                    placeholder={t('auth.form.confirmPasswordPlaceholder')}
                    disabled={isPending}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('auth.form.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 text-sm ${
                      errors.email
                        ? 'border-2 border-red-500'
                        : isDark
                          ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                          : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                    } ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors outline-none`}
                    placeholder={t('auth.form.emailPlaceholder')}
                    disabled={isPending}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label
                    className={`mb-2 block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('auth.form.nickname')}
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={`w-full rounded-lg px-4 py-3 text-sm ${
                      errors.nickname
                        ? 'border-2 border-red-500'
                        : isDark
                          ? 'border border-zinc-800 bg-black text-white focus:border-zinc-700'
                          : 'border border-gray-200 bg-white text-black focus:border-gray-300'
                    } ${isDark ? 'bg-black text-white' : 'bg-white text-black'} transition-colors outline-none`}
                    placeholder={t('auth.form.nicknamePlaceholder')}
                    disabled={isPending}
                  />
                  {errors.nickname && (
                    <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isPending || !isFormValid}
              className={`w-full rounded-lg py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-600'
                  : 'bg-black text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400'
              }`}
            >
              {isPending
                ? isLogin
                  ? t('auth.login.processing')
                  : t('auth.signup.processing')
                : isLogin
                  ? t('auth.login.button')
                  : t('auth.signup.button')}
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
              {t('auth.guest.button')}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              disabled={isPending}
              className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors disabled:opacity-50`}
            >
              {isLogin ? t('auth.toggle.toSignup') : t('auth.toggle.toLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
