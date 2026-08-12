// Server Component — `Auth` owns its own "use client" boundary. Dropping
// the marker here means the root shell no longer hydrates just to render
// a wrapper div. Part of the §10.2.2 "push use client down the tree"
// pass. Consumers with no JS still see the wrapper markup.
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
