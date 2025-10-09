"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    // Load theme from localstorage on mount
    useEffect(()=>{
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    })

    // toggle theme
    const toggleTheme = ()=>{
        setIsDark(!isDark);
        if(!isDark){
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }else{
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <ThemeContext.Provider value={{isDark, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};