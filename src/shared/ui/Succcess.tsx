import type { ReactNode } from "react";

type ErrorProps = {
    children: ReactNode,
}

export function Success({children} : ErrorProps){
    return <section  className="rounded-[30px] p-5 bg-(--panel-bg)">
        <span className="text-green-600 bg-green-100">
            {children}
        </span>
    </section>
}