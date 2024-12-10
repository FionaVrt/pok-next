"use client"

import styles from "./page.module.css";
import PokemonList from "./components/homePage/homePage";

export default function Home() {
  return (
    <div className={styles.page}>
      <PokemonList />
    </div>
  );
}
