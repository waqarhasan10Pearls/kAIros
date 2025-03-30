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

// Helper function to directly apply theme to document
const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Check system preference first
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Then check localStorage
  const savedTheme = localStorage.getItem('theme');
  const initialDarkMode = savedTheme 
    ? savedTheme === 'dark'
    : prefersDark;
  
  // Set initial state
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  
  // Apply theme immediately
  useEffect(() => {
    // Apply the theme on initial load
    applyTheme(initialDarkMode);
  }, [initialDarkMode]);
  
  // Handle theme changes
  useEffect(() => {
    applyTheme(isDarkMode);
    // Save to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
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
