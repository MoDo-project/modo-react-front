import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ThemeState, Theme } from './types'

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const calculateIsDark = (theme: Theme): boolean => {
  if (theme === 'system') return getSystemTheme() === 'dark'
  return theme === 'dark'
}

const updateDOM = (isDark: boolean): void => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', isDark)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: calculateIsDark('system'),

      setTheme: (theme) => {
        const isDark = calculateIsDark(theme)
        updateDOM(isDark)
        set({ theme, isDark })
      },

      toggleTheme: () => {
        const currentIsDark = get().isDark
        const newTheme: Theme = currentIsDark ? 'light' : 'dark'
        get().setTheme(newTheme)
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateDOM(state.isDark)
        }
      },
    }
  )
)

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme, setTheme } = useThemeStore.getState()
    if (theme === 'system') {
      setTheme('system')
    }
  })
}
