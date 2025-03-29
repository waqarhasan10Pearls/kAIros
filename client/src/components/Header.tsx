import { useTheme } from "../hooks/useTheme";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary flex items-center">
            <i className="ri-team-line mr-2"></i>
            ScrumMaster Assistant
          </h1>
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <i className="ri-sun-line text-xl"></i>
              ) : (
                <i className="ri-moon-line text-xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
