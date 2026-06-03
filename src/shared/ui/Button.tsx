import type { ComponentPropsWithoutRef, ReactNode } from "react"

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    children: ReactNode,
    isWithBackground?: boolean,
}

export function Button({children,isWithBackground=true,  ...props} : ButtonProps){
    return <button 
        className={`inline-flex items-center gap-3 rounded-[18px]  px-5 py-4 text-sm font-semibold shadow-sm *:**:
            ${isWithBackground ? "text-white bg-[var(--accent-blue)]" : "" }`}
        {...props}
    >
        {children}
    </button>
}