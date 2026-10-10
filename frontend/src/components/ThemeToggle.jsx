import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle({ className = '' }) {
    const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        try {
            localStorage.setItem('theme', theme)
        } catch (e) {}
    }, [theme])

    return (
        <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            className={`flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-150 active:scale-90 bg-transparent border-none cursor-pointer ${className}`}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
    )
}

export default ThemeToggle
