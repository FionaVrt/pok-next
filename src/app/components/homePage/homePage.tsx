"use client";

import "./homePage.css";
import { useRouter } from "next/navigation";
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
  generation: string; // generation du pokemon
  height: number; // taille du pokemon
  weight: number; // poids du pokemon
}

export default function PokemonList() {
  const router = useRouter();
  const [pokemonList, setPokemonList] = useState<DetailedPokemon[]>([]); // Stocke les donnees detaillees des Pokémon
  const [loading, setLoading] = useState<boolean>(true); // Indique si les donnes chargent
  const [searchTerm, setSearchTerm] = useState<string>(""); // recherche
  const [sortCriteria, setSortCriteria] = useState<string>(""); // critere de tri
  const [sortOrder, setSortOrder] = useState<string>("asc"); // ordre de tri

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
            height: pokemonData.height,
            generation: pokemonData.id.toString(),
            weight: pokemonData.weight,
          };
        });

        const detailedPokemonList = await Promise.all(detailedPokemonPromises);
        setPokemonList(detailedPokemonList); // Stocke les Pokemon detailles
        setLoading(false); // Arrete le chargement
      } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon :", error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemonList = pokemonList
    .filter((pokemon) => {
      return (
        (pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pokemon.types.some((type) => type.toLowerCase().includes(searchTerm.toLowerCase()))) // Recherche par nom ou type
      );
    })
    .sort((a, b) => {
      if (sortCriteria === "height") {
        return sortOrder === "asc" ? a.height - b.height : b.height - a.height;
      }

      if (sortCriteria === "generation") {
        return sortOrder === "asc" ? a.generation.localeCompare(b.generation) : b.generation.localeCompare(a.generation);
      }

      return 0;
    });

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>Liste des Pokémons</h1>

      <input
        type="text"
        placeholder="Rechercher par nom ou type..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="filter-select">
        <option value="">Trier par...</option>
        <option value="height">Taille</option>
        <option value="generation">Génération</option>
      </select>

      <button
        onClick={() => {
          if (sortCriteria === "") {
            return;
          }
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }}
        className="sort-button"
      >
        {sortOrder === "asc" ? "Tri décroissant" : "Tri croissant"}
      </button>

      <ul>
        {filteredPokemonList.length > 0 ? (
          filteredPokemonList.map((pokemon, index) => (
            <li key={index} className="pokemon-card" onClick={() => router.push(`/pokemon/${pokemon.name}`)}>
              <img src={pokemon.sprite} alt={pokemon.name} />
              <p className="pokemon-name">{pokemon.name}</p>
              <div className="pokemon-types">
                {pokemon.types.map((type, i) => (
                  <div key={i} className="type-logo">
                    <img src={`/logo/${type}.svg`} alt={type} />
                    <span className="type-name">{type}</span>
                  </div>
                ))}
              </div>
            </li>
          ))
        ) : (
          <p>Aucun Pokémon trouvé</p>
        )}
      </ul>
    </div>
  );
}
