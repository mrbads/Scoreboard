import { ReactNode } from "react";

interface LedscreenProps {
    component: ReactNode;
}

// @ts-ignore
export default function Ledscreen( { component } : LedscreenProps) {
    return (
        <>{component}</>
    )
}