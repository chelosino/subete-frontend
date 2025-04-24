import { useEffect } from "react";

export default function EmbedApp() {
  useEffect(() => {
    const shop = new URLSearchParams(window.location.search).get("shop");
    window.location.href = `/widget?shop=${shop}`;
  }, []);

  return <p>Redirigiendo a la app...</p>;
}
