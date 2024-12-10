// PokemonCard.tsx
import React from "react";
import "./Pokemoncard.css"; 

interface PokemonCardProps {
  name: string;
  sprite: string;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, sprite }) => {
  return (
    <div className="pokemon-card"> {/* Utilisation de la classe CSS */}
      <img src={sprite} alt={name} />
      <h2>{name}</h2>
    </div>
  );
};

export default PokemonCard;