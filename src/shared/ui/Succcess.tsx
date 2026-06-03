import type { ReactNode } from "react";

type ErrorProps = {
    children: ReactNode,
}

export function Success({children} : ErrorProps){
    return <span className="text-green-600 bg-green-100">
        {children}
    </span>
}