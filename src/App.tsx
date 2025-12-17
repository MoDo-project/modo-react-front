import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/shared/config/i18n'
import { useEffect } from 'react'
import { useThemeStore } from 'entities/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { queryConfig } from '@/shared/api'

// QueryClient 생성
const queryClient = new QueryClient(queryConfig)

function App() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const isDark = useThemeStore.getState().isDark
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default App
