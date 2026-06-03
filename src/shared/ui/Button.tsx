import type { ComponentPropsWithoutRef, ReactNode } from "react"

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    children: ReactNode
}

export function Button({children, ...props} : ButtonProps){
    return <button 
        className="inline-flex items-center gap-3 rounded-[18px] bg-[var(--accent-blue)] px-5 py-4 text-sm font-semibold text-white shadow-sm" 
        {...props}
    >
        {children}
    </button>
}