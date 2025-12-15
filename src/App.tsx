import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { AuthProvider } from './contexts/AuthContext'
import { useEffect } from 'react'
import { useThemeStore } from 'entities/theme'

function App() {
  // Theme 초기화 (Zustand persist가 자동으로 처리)
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    // 초기 테마 설정 (persist에서 자동 복원)
    const isDark = useThemeStore.getState().isDark
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  )
}

export default App
