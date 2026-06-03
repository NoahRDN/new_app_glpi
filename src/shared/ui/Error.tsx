import type { ReactNode } from "react";

type ErrorProps = {
    children: ReactNode,
}

export function Error({children} : ErrorProps){
    return <span className="text-red-500">
        {children}
    </span>
}