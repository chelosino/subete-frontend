import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  name: string;
  goal: number;
  created_at: string;
}

export default function AdminCampaigns() {
  const [campaign, setCampaign] = useState<Campaign[]>([]);
  const shop = new URLSearchParams(window.location.search).get("shop");

  useEffect(() => {
    if (!shop) return;

    fetch(`https://subete-backend.onrender.com/api/campaigns?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch((err) => console.error("❌ Error cargando campañas:", err));
  }, [shop]);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">📋 Campañas activas</h1>
      {campaign.length === 0 ? (
        <p>No hay campañas creadas aún.</p>
      ) : (
        <ul className="space-y-4">
          {campaign.map((c) => (
            <li key={c.id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{c.name}</h2>
              <p>Meta: {c.goal}</p>
              <p className="text-sm text-gray-500">Creada: {new Date(c.created_at).toLocaleString()}</p>
              <a
                href={`/admin/campaign/${c.id}?shop=${shop}`}
                className="text-blue-600 underline"
              >
                Ver detalles →
              </a>
            </li>
          ))}
        </ul>
      )}
      <a
        href={`/admin/campaigns?shop=${shop}`}
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Ver campañas existentes
      </a>
    </div>
  );
}
