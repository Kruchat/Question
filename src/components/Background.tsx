export default function Background() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-1000">
            {/* Notebook Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.07] dark:opacity-[0.04]"
                style={{
                    backgroundImage: 'linear-gradient(#3b82f6 1.5px, transparent 1.5px), linear-gradient(90deg, #3b82f6 1.5px, transparent 1.5px)',
                    backgroundSize: '30px 30px'
                }}
            ></div>

            {/* Left Red Margin Line (Notebook style) */}
            <div className="absolute top-0 bottom-0 left-[8%] w-[2px] bg-rose-500/20 dark:bg-rose-500/10"></div>
            <div className="absolute top-0 bottom-0 left-[8.5%] w-[1px] bg-rose-500/10 dark:bg-rose-500/5"></div>

            {/* Floating SVG School Items Container */}
            <div className="absolute inset-0 opacity-40 dark:opacity-20 flex items-center justify-center">

                {/* 1. Floating Pencil (Top Right) */}
                <svg className="absolute top-[15%] right-[15%] w-24 h-24 text-amber-500/40 animate-[float-slow_15s_ease-in-out_infinite]"
                    viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotate(45deg)' }}>
                    <path d="M16.29 2.71C16.92 2.08 17.93 2.08 18.57 2.71L21.29 5.43C21.92 6.06 21.92 7.08 21.29 7.71L9.13 19.87C8.75 20.25 8.24 20.5 7.69 20.57L3 21L3.43 16.31C3.5 15.76 3.75 15.25 4.13 14.87L16.29 2.71ZM18 7.5L16.5 6L15 7.5L16.5 9L18 7.5ZM5.52 16.2L5.27 18.73L7.8 18.48L13.88 12.4L11.6 10.12L5.52 16.2Z" />
                </svg>

                {/* 2. Floating Ruler (Bottom Left) */}
                <svg className="absolute bottom-[20%] left-[10%] w-32 h-32 text-blue-500/30 animate-[float-fast_18s_ease-in-out_infinite-reverse]"
                    viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotate(-30deg)' }}>
                    <path d="M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H20C21.1 4 22 4.9 22 6ZM20 6H4V18H20V6ZM6 8H8V12H6V8ZM10 8H12V10H10V8ZM14 8H16V12H14V8ZM18 8H20V10H18V8Z" />
                </svg>

                {/* 3. Floating Book (Bottom Right) */}
                <svg className="absolute bottom-[10%] right-[25%] w-20 h-20 text-emerald-500/30 animate-[float-medium_22s_ease-in-out_infinite]"
                    viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotate(15deg)' }}>
                    <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.05C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.1 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.15C22.75 21.15 23 20.9 23 20.65V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z" />
                </svg>

                {/* 4. Floating Math Symbols */}
                <div className="absolute top-[30%] left-[25%] text-5xl font-bold text-indigo-400/20 animate-[spin_30s_linear_infinite]">+</div>
                <div className="absolute top-[60%] right-[30%] text-6xl font-bold text-sky-400/20 animate-[spin_25s_linear_infinite_reverse]">&times;</div>
                <div className="absolute top-[20%] right-[40%] text-4xl font-bold text-pink-400/20 animate-[float-slow_20s_ease-in-out_infinite]">&divide;</div>
                <div className="absolute bottom-[35%] left-[20%] text-7xl font-bold text-amber-500/10 animate-[float-fast_16s_ease-in-out_infinite]">&#8722;</div>

                {/* Soft Glowing Focus point center behind everything */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-[100px]"></div>
            </div>
        </div>
    );
}
