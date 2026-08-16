// Route-local shell for the three /shared/[slug] states (view, expired,
// not-found). Renders the TwiqBg backdrop + TWIQ logo top-left so a public
// share link visibly lives inside the TWIQ brand — not on a generic Tailwind
// stub. Content stacks above the fixed backdrop via `relative z-10`.
//
// Server Component — no state, no effects, no browser APIs.

import Image from "next/image";
import Link from "next/link";
import TwiqBg from "@/components/dashboardComponent/twiqBg";
import SharedThemeToggle from "./SharedThemeToggle";

export default function SharedPageShell({ children }) {
  return (
    <>
      <TwiqBg />
      <Link
        href="/"
        aria-label="TWIQ"
        className="fixed top-4 left-4 z-20 inline-flex items-center"
      >
        {/* Light-mode logo — same swap pattern as landingPageComponents/Header.jsx */}
        <Image
          src="/images/logo/twiq_method_logo_black.png"
          width={600}
          height={600}
          alt="TWIQ Logo Light"
          priority
          className="block h-auto w-[120px] dark:hidden"
        />
        {/* Dark-mode logo */}
        <Image
          src="/images/logo/twiq_method_logo_white.png"
          width={600}
          height={600}
          alt="TWIQ Logo Dark"
          priority
          className="hidden h-auto w-[120px] dark:block"
        />
      </Link>
      <SharedThemeToggle />
      <div className="relative z-10">{children}</div>
    </>
  );
}
