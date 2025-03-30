import { createContext, useContext } from "react";

// A simple theme context with just what we need
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Create a context with default values
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Check if dark mode is currently applied
  const isDarkMode = document.documentElement.classList.contains("dark");
  
  // Simple toggle function that directly manipulates DOM
  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      // Remove dark mode
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Add dark mode
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Apply theme on initial page load (outside of React)
(function() {
  // On page load or when changing themes
  if (localStorage.theme === 'dark' || 
     (!('theme' in localStorage) && 
      window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext);
};
