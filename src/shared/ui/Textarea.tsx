import type { ComponentPropsWithoutRef, ReactNode } from "react"

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & { 
    children?: ReactNode
}

export function Textarea({children,...props}:TextareaProps){
    return <textarea
                className="w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none border-(--panel-border) bg-(--panel-soft) text-(--text-primary)"
                {...props}
            >
                {children}
            </textarea>
}