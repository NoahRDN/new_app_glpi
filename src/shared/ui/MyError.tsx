import type { ReactNode } from "react";

type ErrorProps = {
    children: ReactNode,
}

export function MyError({children} : ErrorProps){
    return <span className="text-red-500 bg-red-100">
        {children}
    </span>
}