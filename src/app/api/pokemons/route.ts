export interface Pokemon {
    name: string;
    url: string;
}

export interface ApiResponse {
    results: Pokemon[];
}

export async function GET(request: Request) {
    const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0"
    );
    const data = await res.json();

    return Response.json({ data });
}