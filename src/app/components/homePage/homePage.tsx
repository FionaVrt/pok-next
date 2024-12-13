"use client";

import "./homePage.css";
import { useRouter } from "next/navigation";
import ScrollToTop from "../topButton/topButton";
import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Definition des types pour les donnees des Pokemon
interface Pokemon {
  name: string;
  url: string;
}

interface DetailedPokemon {
  name: string;
  sprite: string; // URL de l'image du Pokemon
  types: string[]; // type du pokemon
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
      if (sortCriteria === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortCriteria === "height") {
        return sortOrder === "asc" ? a.height - b.height : b.height - a.height;
      }
      if (sortCriteria === "weight") {
        return sortOrder === "asc" ? a.weight - b.weight : b.weight - a.weight;
      }
      return 0;
    });

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1 id="scroll">Liste des Pokémons</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Rechercher par nom ou type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className="filter-select">
          <option value="">Trier par...</option>
          <option value="name">Nom</option>
          <option value="height">Taille</option>
          <option value="weight">Poids</option>
        </select>

        {sortCriteria && (
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="sort-button"
          >
            {sortOrder === "asc" ? (
              <>
                <FaArrowUp /> 
              </>
            ) : (
              <>
                <FaArrowDown /> 
              </>
            )}
          </button>
        )}
      </div>

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
          <p className="error">Aucun Pokémon trouvé</p>
        )}
      </ul>

      <ScrollToTop />

    </div>
  );
}