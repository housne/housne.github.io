import { Theme } from "../types/theme";

export function getDefaultTheme(): Theme {
  if (window.localStorage.getItem('theme')) {
    const theme = window.localStorage.getItem('theme')
    if (theme === Theme.Light || theme === Theme.Dark || theme === Theme.System) {
      return theme;
    }
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Dark;
  }
  return Theme.Light;
}