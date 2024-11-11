import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Theme = 'classic' | 'dark' | 'pastel' | 'custom';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  setCustomColors: (colors: { primary: string; secondary: string; background: string; text: string }) => void;
}

const defaultColors = {
  classic: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#F3F4F6',
    text: '#1F2937',
  },
  dark: {
    primary: '#60A5FA',
    secondary: '#34D399',
    background: '#1F2937',
    text: '#F9FAFB',
  },
  pastel: {
    primary: '#93C5FD',
    secondary: '#6EE7B7',
    background: '#FFF1F2',
    text: '#4B5563',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('classic');
  const [customColors, setCustomColors] = useState(defaultColors.classic);

  useEffect(() => {
    if (theme !== 'custom') {
      setCustomColors(defaultColors[theme]);
    }

    // Apply theme colors to CSS variables
    const root = document.documentElement;
    Object.entries(customColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [theme, customColors]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColors, setCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
};