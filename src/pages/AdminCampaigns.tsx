import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  nombre: string;
  meta: number;
  created_at: string;
}

export default function AdminCampaigns() {
  const [campañas, setCampañas] = useState<Campaign[]>([]);
  const shop = new URLSearchParams(window.location.search).get("shop");

  useEffect(() => {
    if (!shop) return;

    fetch(`https://subete-backend.onrender.com/api/campaigns?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => setCampañas(data))
      .catch((err) => console.error("❌ Error cargando campañas:", err));
  }, [shop]);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">📋 Campañas activas</h1>
      {campañas.length === 0 ? (
        <p>No hay campañas creadas aún.</p>
      ) : (
        <ul className="space-y-4">
          {campañas.map((c) => (
            <li key={c.id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{c.nombre}</h2>
              <p>Meta: {c.meta}</p>
              <p className="text-sm text-gray-500">Creada: {new Date(c.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
