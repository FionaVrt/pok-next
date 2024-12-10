"use client";

import "./homePage.css";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";

// Definition des types pour les donnees des Pokemon
interface Pokemon {
  name: string;
  url: string;
}

interface DetailedPokemon {
  name: string;
  sprite: string; // URL de l'image du Pokemon
}

export default function PokemonList () {
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState<DetailedPokemon[]>([]); // Stocke les donnees detaillees des Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Indique si les donnees chargent

  useEffect(() => {
    // Appelle l'API pour recuperer les Pokemon
    const fetchPokemon = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        const data = await response.json(); // Convertit la reponse en JSON

        // Recupere les donnees detaillees pour chaque Pokemon
        const detailedPokemonPromises = data.results.map(async (pokemon: Pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          return {
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default, // URL de l'image
          };
        });

        const detailedPokemonList = await Promise.all(detailedPokemonPromises);
        setPokemonList(detailedPokemonList); // Stocke les Pokemon detailles
        setLoading(false); // Arrete le chargement
      } catch (error) {
        console.error("Erreur lors de la recuperation des Pokemon :", error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>Liste des Pokemons</h1>
      <ul>
        {pokemonList.map((pokemon, index) => (
          <li key={index}>
            <img src={pokemon.sprite} alt={pokemon.name} />
            <p>{pokemon.name}</p>
            <button onClick={() => router.push(`/pokemon/${index}`)}>Voir</button>
          </li>
        ))}
      </ul> 
    </div>
  );
};
