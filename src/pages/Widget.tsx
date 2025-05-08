import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  name: string;
  goal: number;
  created_at: string;
}

interface Participant {
  id: string;
  client_id: string;
  campaign_id: string;
}

export default function Widget() {
  const shop = new URLSearchParams(window.location.search).get("shop");

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔍 Cargar campaña activa
  useEffect(() => {
    if (!shop) return;

    fetch(`https://subete-backend.onrender.com/api/campaigns?shop=${shop}`)
      .then((res) => res.json())
      .then((data: Campaign[]) => {
        if (data.length > 0) {
          setCampaign(data[0]);
        }
      })
      .catch((err) => {
        console.error("❌ Error loading campaign:", err);
        setCampaign(null);
      });
  }, [shop]);

  // 👥 Cargar participantes de campaña
  useEffect(() => {
    if (!campaign?.id) return;

    fetch(`https://subete-backend.onrender.com/api/participants?campaign_id=${campaign.id}`)
      .then((res) => res.json())
      .then((data: Participant[]) => setParticipants(data))
      .catch((err) => console.error("❌ Error loading participants:", err));
  }, [campaign?.id, status]); // ← se actualiza al inscribirse

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !campaign?.id) return;

    setStatus("loading");
    setErrorMsg("");

    const res = await fetch("https://subete-backend.onrender.com/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        campaign_id: campaign.id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("success");
      setName("");
      setEmail("");
    } else if (res.status === 409) {
      setStatus("exists");
    } else {
      setStatus("error");
      setErrorMsg(data.error || "Unexpected error");
    }
  };

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">No active campaign found</h2>
        <p>This store doesn't have a campaign right now.</p>
      </div>
    );
  }

  const progress = Math.min((participants.length / campaign.goal) * 100, 100).toFixed(1);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>
      <p className="text-gray-600">Help us reach our goal of {campaign.goal} participants!</p>

      {/* 🔵 Progreso de la campaña */}
      <div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-full"
            style={{ width: `${progress}%`, transition: "width 0.5s ease" }}
          ></div>
        </div>
        <p className="text-sm text-center mt-1">
          {participants.length} / {campaign.goal} joined ({progress}%)
        </p>
      </div>

      {/* 📝 Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Your Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Your Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Join Campaign"}
        </button>
      </form>

      {/* 🟢 Feedback */}
      {status === "success" && (
        <p className="text-green-600 font-medium">🎉 Thanks for joining!</p>
      )}
      {status === "exists" && (
        <p className="text-yellow-600 font-medium">You're already in this campaign.</p>
      )}
      {status === "error" && (
        <p className="text-red-600 font-medium">Error: {errorMsg}</p>
      )}
    </div>
  );
}
