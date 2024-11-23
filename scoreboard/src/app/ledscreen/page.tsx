
// @ts-expect-error: Shows the passed components from its parent
export function Ledscreen( { component } : { component : React.ReactNode}) {
    return (
        <>{component}</>
    )
}