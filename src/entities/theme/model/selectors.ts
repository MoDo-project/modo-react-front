import { ThemeState } from './types'

export const selectTheme = (state: ThemeState) => state.theme
export const selectIsDark = (state: ThemeState) => state.isDark
export const selectSetTheme = (state: ThemeState) => state.setTheme
export const selectToggleTheme = (state: ThemeState) => state.toggleTheme
