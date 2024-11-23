import { ReactNode } from "react";

interface LedscreenProps {
    component: ReactNode;
}

// @ts-expect-error: Shows the passed components from its parent
export default function Ledscreen( { component } : LedscreenProps) {
    return (
        <>{component}</>
    )
}