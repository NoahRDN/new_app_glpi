import type { ComponentPropsWithoutRef, ReactNode } from "react"

type LabelProps = ComponentPropsWithoutRef<"label"> & {
    children: ReactNode
}

export function Label({children, ...props} : LabelProps) {
    return <label className="text-sm font-medium text-(--text-secondary)" {...props}>
        {children}
    </label>
}