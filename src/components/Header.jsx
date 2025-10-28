import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }) => (
  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border-b p-3 md:p-4`}>
    <div className="flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`md:hidden p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>
      <h1 className={`text-xl md:text-3xl font-bold flex-1 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        JSON Tree Visualizer
      </h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
      >
        {darkMode ? <Sun /> : <Moon />}
      </button>
    </div>
  </div>
);

export default Header;
