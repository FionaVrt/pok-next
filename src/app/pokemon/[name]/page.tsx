import React from "react";
import Image from "next/image";
import { BackButton } from "../../components/backButton/backButton";
import "./page.css";

async function fetchPokemonDetails(name: string) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des détails du Pokémon");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default async function PokemonPage({
    params: paramsPromise,
}: {
    params: Promise<{ name: string }>;
}) {
    // Résolution explicite de la promesse `params`
    const params = await paramsPromise;

    // Récupération des détails du Pokémon
    const pokemonData = await fetchPokemonDetails(params.name);

    if (!pokemonData) {
        return <p>Impossible de récupérer les informations pour le Pokémon {params.name}.</p>;
    }

    return (
        <div className="pokemon-details">
            <div className="title"> 
                <BackButton />
                <h1>{pokemonData.name}</h1>
                
            </div>
            <Image
                src={pokemonData.sprites.front_default}
                alt={pokemonData.name}
                className="pokemon-image"
                width={96}
                height={96}
            />
            <p>
                <strong>Type:</strong>{" "}
                {pokemonData.types.map((type: any) => type.type.name).join(", ")}
            </p>
            <p><strong>Poids:</strong> {pokemonData.weight}</p>
            <p><strong>Taille:</strong> {pokemonData.height}</p>            
        </div>
    );
}
