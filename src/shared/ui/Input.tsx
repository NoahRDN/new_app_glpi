import type { ComponentPropsWithoutRef } from "react"

type InputProps = ComponentPropsWithoutRef<"input">

export function Input({...props} : InputProps){
    return <input
    className="w-full rounded-[18px] border px-4 py-4 text-lg font-semibold outline-none border-(--panel-border) bg-(--panel-soft) text-(--text-primary)" 
    {...props} />
}
