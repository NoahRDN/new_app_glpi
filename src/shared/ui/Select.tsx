import type { ComponentPropsWithoutRef, ReactNode } from "react"

type SelectProps = 
    ComponentPropsWithoutRef<"select"> & {
    children: ReactNode
}

export function Select({children, ...props} : SelectProps){
    return <select
    className="w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none border-(--panel-border) bg-(--panel-soft) text-(--text-primary)" 
    {...props} >
        {children}
    </select>

}
