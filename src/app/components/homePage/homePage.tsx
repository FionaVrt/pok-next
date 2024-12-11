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
  types: string[]; // type du pokemon
}

export default function PokemonList() {
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState<DetailedPokemon[]>([]); // Stocke les donnees detaillees des Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Indique si les donnees chargent
  const [searchTerm, setSearchTerm] = useState<string>(""); // recherche
  const [filterType, setFilterType] = useState<string>(""); // filtre

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        const data = await response.json(); // Convertit la reponse en JSON

        const detailedPokemonPromises = data.results.map(async (pokemon: Pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          return {
            name: pokemonData.name,
            sprite: pokemonData.sprites.front_default, // URL de l'image
            types: pokemonData.types.map((t: any) => t.type.name),
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

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    return (
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "" || pokemon.types.includes(filterType))
    );
  });

  const uniqueTypes = Array.from(new Set(pokemonList.flatMap((pokemon) => pokemon.types)));

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>Liste des Pokémons</h1>

      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="filter-select"
      >
        <option value="">Tous les types</option>
        {uniqueTypes.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>

      <ul>
        {filteredPokemonList.length > 0 ? (
          filteredPokemonList.map((pokemon, index) => (
            <li
              key={index}
              className="pokemon-card"
              onClick={() => router.push(`/pokemon/${index}`)}
            >
              <img src={pokemon.sprite} alt={pokemon.name} />
              <p className="pokemon-name">{pokemon.name}</p>
              <div className="pokemon-types">
                {pokemon.types.map((type, i) => (
                  <img
                    key={i}
                    className="type-logo"
                    src={`/logo/${type}.svg`}
                    alt={type}
                  />
                ))}
              </div>
            </li>
          ))
        ) : (
          <p>Aucun Pokémon trouvé avec ce nom ou type.</p>
        )}
      </ul>
    </div>
  );
}
