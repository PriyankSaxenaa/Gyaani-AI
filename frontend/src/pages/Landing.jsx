import React from 'react'
import { motion } from 'motion/react'
import { FcGoogle } from "react-icons/fc"
import { MessageSquare, Code2, Globe, FileText, Presentation, ImageIcon } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

const EASE = [0.23, 1, 0.32, 1]

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, transform: 'translateY(14px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: 0.5, ease: EASE, delay }
})

const features = [
    { icon: MessageSquare, label: "Chat" },
    { icon: Code2, label: "Coding" },
    { icon: Globe, label: "Search" },
    { icon: FileText, label: "PDF" },
    { icon: Presentation, label: "PPT" },
    { icon: ImageIcon, label: "Vision" },
]

const techStack = [
    "React", "Node.js", "Express", "MongoDB", "Redis",
    "LangGraph", "Groq", "Gemini", "Qdrant", "AWS S3", "Razorpay"
]

function Landing({ onGoogleLogin }) {
    return (
        <div className='relative h-screen w-full overflow-y-auto overflow-x-hidden bg-surface text-on-surface flex flex-col items-center'>

            {/* ambient glow background */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-primary/20 blur-[120px]' />
                <div className='absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-secondary-container/25 blur-[120px]' />
                <div className='absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-tertiary/10 blur-[120px]' />
            </div>

            <ThemeToggle className='absolute top-5 right-5 z-20' />

            <div className='relative z-10 w-full flex-1 flex flex-col items-center px-6 py-14 gap-14'>

                {/* logo */}
                <motion.div {...fadeUp(0)} className='flex items-center'>
                    <img src='/logo.png' alt='Gyaani AI' className='h-28 w-auto drop-shadow-[0_0_24px_rgba(245,158,11,0.25)]' />
                </motion.div>

                {/* hero */}
                <div className='flex flex-col items-center text-center gap-4 max-w-xl'>
                    <motion.h1 {...fadeUp(0.05)} className='font-display text-[32px] md:text-[40px] font-bold text-on-surface tracking-tight leading-tight'>
                        Your all-in-one <span className='text-primary'>AI workspace</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.1)} className='text-[15px] text-on-surface-variant leading-relaxed max-w-md'>
                        Chat, generate code, search the web, write PDFs and decks, and create images — one assistant, seven specialized agents.
                    </motion.p>
                </div>

                {/* feature grid */}
                <motion.div {...fadeUp(0.15)} className='flex flex-wrap justify-center gap-3 max-w-2xl'>
                    {features.map(({ icon: Icon, label }) => (
                        <div key={label} className='flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/20 text-on-surface-variant text-[13px] font-medium'>
                            <Icon size={14} className='text-secondary' />
                            {label}
                        </div>
                    ))}
                </motion.div>

                {/* sign-in card */}
                <motion.div
                    {...fadeUp(0.2)}
                    className='w-full max-w-[360px] bg-surface-container-low/95 backdrop-blur-xl border border-outline-variant/40 rounded-xl p-7 flex flex-col gap-5 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.65)]'
                >
                    <div className='flex flex-col gap-1 text-center'>
                        <h2 className='font-display text-[17px] font-semibold text-on-surface tracking-tight'>Welcome to Gyaani AI</h2>
                        <p className='text-[13px] text-on-surface-variant'>Sign in to start your first conversation.</p>
                    </div>

                    <button
                        className='w-full flex items-center justify-center gap-3 py-[11px] rounded-md text-sm font-medium text-on-surface bg-surface-container-high border border-outline-variant/50 hover:bg-surface-container-highest hover:border-outline-variant transition-all duration-150 active:scale-[0.97] cursor-pointer'
                        onClick={onGoogleLogin}
                    >
                        <FcGoogle size={16} />
                        Continue with Google
                    </button>

                    <p className='text-[11px] text-on-surface-variant/70 text-center leading-relaxed'>
                        New here? Signing in with Google also creates your account — no separate sign-up needed.
                    </p>
                </motion.div>
            </div>

            {/* footer: tech stack + credit */}
            <motion.footer
                {...fadeUp(0.3)}
                className='relative z-10 w-full flex flex-col items-center gap-3 px-6 pb-8 pt-2'
            >
                <div className='flex flex-wrap justify-center gap-x-3 gap-y-1.5 max-w-2xl'>
                    {techStack.map((tech) => (
                        <span key={tech} className='font-mono text-[10px] text-on-surface-variant/60 tracking-wide uppercase'>
                            {tech}
                        </span>
                    ))}
                </div>
                <p className='text-[11px] text-on-surface-variant/50'>
                    Developed by <span className='text-on-surface-variant font-medium'>Priyank Saxena</span>
                </p>
            </motion.footer>
        </div>
    )
}

export default Landing
