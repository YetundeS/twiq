"use client";

import Auth from "./auth/page";
import styles from "./page.module.css";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Auth />
      </main>
    </div>
  );
}
