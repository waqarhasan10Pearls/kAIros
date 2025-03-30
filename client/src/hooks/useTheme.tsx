import { useState, createContext, useContext, useEffect } from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create a context with a default value to avoid undefined checks
const defaultThemeContext: ThemeContextType = {
  isDarkMode: false,
  toggleTheme: () => {}
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('kairosTheme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // If no saved preference, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme class on initial render and when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      // Save to localStorage
      localStorage.setItem('kairosTheme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};
