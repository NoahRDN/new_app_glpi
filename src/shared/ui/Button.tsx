import type { ComponentPropsWithoutRef, ReactNode } from "react"

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    children: ReactNode,
    isWithBackground?: boolean,
    otherClassName?: string,
}

export function Button({children,isWithBackground=true,otherClassName,  ...props} : ButtonProps){
    return <button 
        className={` inline-flex items-center gap-3 rounded-[18px] px-5 py-4 text-sm font-semibold *:**: ${otherClassName}
            ${isWithBackground ? "text-white bg-(--accent-blue)" : "text-(--text-primary) bg-(--panel-soft)" }`}
        {...props}
    >
        {children}
    </button>
}
