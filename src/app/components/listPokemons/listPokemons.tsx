"use client";

import React, { useState, useEffect } from "react";

// Définition des types pour les données des Pokémon
interface Pokemon {
  name: string;
  url: string;
}

interface DetailedPokemon {
  name: string;
  sprite: string; // URL de l'image du Pokémon
}

const PokemonList: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<DetailedPokemon[]>([]); // Stocke les données détaillées des Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Indique si les données chargent

  useEffect(() => {
    // Appelle l'API pour récupérer les Pokémon
    const fetchPokemon = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        const data = await response.json(); // Convertit la réponse en JSON

        // Récupère les données détaillées pour chaque Pokémon
        const detailedPokemonPromises = data.results.map(async (pokemon: Pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          return {
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default, // URL de l'image
          };
        });

        const detailedPokemonList = await Promise.all(detailedPokemonPromises);
        setPokemonList(detailedPokemonList); // Stocke les Pokémon détaillés
        setLoading(false); // Arrête le chargement
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon :", error);
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
      <h1>Liste des Pokémon</h1>
      <ul style={{ display: "flex", flexWrap: "wrap", listStyle: "none", padding: 0 }}>
        {pokemonList.map((pokemon, index) => (
          <li key={index} style={{ margin: "10px", textAlign: "center" }}>
            <img src={pokemon.sprite} alt={pokemon.name} width="100" height="100" />
            <p>{pokemon.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonList;
