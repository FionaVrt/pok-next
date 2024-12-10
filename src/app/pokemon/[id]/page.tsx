import "./page.css";

export default async function Page({ 
    params,
}: {
    params: Promise<{ name: string }>
}) {
    const name  = (await params).name;
    return (
        <div>Mon pokemon {`/pokemon/${name}`}</div>
    )
}