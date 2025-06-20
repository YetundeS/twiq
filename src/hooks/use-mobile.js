"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initial state: undefined (unknown on server)
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const onChange = (e) => {
      setIsMobile(e.matches);
    };

    // Set initial value on client only
    setIsMobile(mql.matches);

    mql.addEventListener
      ? mql.addEventListener("change", onChange)
      : mql.addListener(onChange); // fallback

    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", onChange)
        : mql.removeListener(onChange);
    };
  }, []);

  // Return a boolean, fallback false if undefined (optional)
  return !!isMobile;
}
