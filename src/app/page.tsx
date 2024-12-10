import styles from "./page.module.css";
import PokemonList from "./components/listPokemons/listPokemons";

export default function Home() {
  return (
    <div className={styles.page}>
      <PokemonList />
    </div>
  );
}
