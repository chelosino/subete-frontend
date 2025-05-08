import { useEffect, useState } from "react";
import { useRoute } from "wouter";

interface Participant {
  id: string;
  name: string;
  created_at: string;
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

  useEffect(() => {
    if (!id || !shop) return;

    // Fetch campaign data
    fetch(`https://subete-backend.onrender.com/api/campaigns/${id}?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch((err) => console.error("Error fetching campaign:", err));

    // Fetch participants
    fetch(`https://subete-backend.onrender.com/api/participants?campaign_id=${id}`)
      .then((res) => res.json())
      .then((data) => setParticipants(data))
      .catch((err) => console.error("Error fetching participants:", err));
  }, [id, shop]);

  if (!campaign) return <p>Loading campaign...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>
      <p>Goal: {campaign.goal}</p>

      <h2 className="text-xl font-semibold mt-4">👥 Participants</h2>
      {participants.length === 0 ? (
        <p className="text-gray-600">No participants yet.</p>
      ) : (
        <ul className="list-disc pl-6">
          {participants.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}

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
