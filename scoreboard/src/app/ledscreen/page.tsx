
// @ts-expect-error: Shows the passed components from its parent
export default function Ledscreen( { component } : { component : React.ReactNode}) {
    return (
        <>{component}</>
    )
}