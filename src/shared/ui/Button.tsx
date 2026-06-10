import type { ComponentPropsWithoutRef, ReactNode } from "react"

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    children: ReactNode,
    isWithBackground?: boolean,
    className?: string,
}

export function Button({children,isWithBackground=true,className="",  ...props} : ButtonProps){
    return <button 
        className={`inline-flex items-center gap-3 rounded-[18px] px-5 py-4 text-sm font-semibold *:**: ${className}
            ${isWithBackground ? "text-white bg-(--accent-blue)" : "text-(--text-primary) bg-(--panel-soft)" }`}
        {...props}
    >
        {children}
    </button>
}
