import { useEffect, useState } from "react";
import { useRoute } from "wouter";

interface Participant {
  id: string;
  name: string;
  email: string;
  joined_at: string;
}

interface Campaign {
  id: string;
  name: string;
  goal: number;
  created_at: string;
}

export default function AdminCampaign() {
  const [, params] = useRoute("/admin/campaign/:id");
  const id = params?.id;
  const shop = new URLSearchParams(window.location.search).get("shop");

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [progress, setProgress] = useState(0);

  // 🔄 Cargar campaña y participantes
  useEffect(() => {
    if (!id || !shop) return;

    fetch(`https://subete-backend.onrender.com/api/campaigns/${id}?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch((err) => console.error("Error fetching campaign:", err));

    fetch(`https://subete-backend.onrender.com/api/participants?campaign_id=${id}`)
      .then((res) => res.json())
      .then((data) => setParticipants(data))
      .catch((err) => console.error("Error fetching participants:", err));
  }, [id, shop]);

  // 📈 Calcular progreso
  useEffect(() => {
    if (campaign) {
      const percent = Math.min((participants.length / campaign.goal) * 100, 100);
      setProgress(percent);
    }
  }, [participants, campaign]);

  if (!campaign) return <p>Loading campaign...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>
      <p>Goal: {campaign.goal}</p>

      {/* 🔵 Barra de progreso */}
      <div>
        <p>
          Participants: {participants.length} / {campaign.goal}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
          />
        </div>
      </div>

      {/* 👥 Lista de participantes */}
      <h2 className="text-xl font-semibold mt-4">Participants</h2>
      {participants.length === 0 ? (
        <p className="text-gray-600">No participants yet.</p>
      ) : (
        <ul className="list-disc pl-6">
          {participants.map((p) => (
            <li key={p.id}>
              {p.name} ({p.email})
            </li>
          ))}
        </ul>
      )}

      {/* 🔙 Navegación */}
      <div className="space-x-4 mt-6">
        <a
          href={`/admin?shop=${shop}`}
          className="inline-block text-blue-600 hover:underline"
        >
          + Create new campaign
        </a>
        <a
          href={`/admin/campaigns?shop=${shop}`}
          className="inline-block text-blue-600 hover:underline"
        >
          ← Back to campaigns
        </a>
      </div>
    </div>
  );
}
