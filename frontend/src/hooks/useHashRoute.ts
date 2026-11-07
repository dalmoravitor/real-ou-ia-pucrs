import { useEffect, useState } from "react";

const current = () => window.location.hash.replace(/^#/, "") || "/";

export function useHashRoute() {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    const onChange = () => setRoute(current());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
