import { ReactNode } from "react";

interface LedscreenProps {
    component: ReactNode;
}

export default function Ledscreen( { component } : LedscreenProps) {
    return (
        <>{component}</>
    )
}