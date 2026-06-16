import type { ComponentPropsWithoutRef, ReactNode } from "react"

type LabelProps = ComponentPropsWithoutRef<"label"> & {
    children: ReactNode,
    className?: string
}

export function Label({children, className, ...props} : LabelProps) {
    return <label className={`text-sm font-medium text-(--text-secondary) ${className}`} {...props}>
        {children}
    </label>
}