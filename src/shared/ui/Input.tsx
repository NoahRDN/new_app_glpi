import type { ComponentPropsWithoutRef } from "react"

type InputProps = ComponentPropsWithoutRef<"input">

export function Input({...props} : InputProps){
    return <input
    className="border-2" 
    {...props} />
}