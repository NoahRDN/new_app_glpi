import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ErrorProps = {
    children: ReactNode,
    className?: string,
}

export function MyError({children, className} : ErrorProps){
    return <span className={twMerge(
        "text-red-500 bg-red-100 flex justify-center",
        className
      )}>
        {children}
    </span>
}