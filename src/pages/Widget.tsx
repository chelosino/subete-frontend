import { useEffect, useState } from "react";

export default function Widget() {
  const shop = new URLSearchParams(window.location.search).get("shop");
  const productId = new URLSearchParams(window.location.search).get("product_id");

  const [campaign, setCampaign] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Cargar campaña activa
  useEffect(() => {
    if (!shop || !productId) return;

    fetch(
      `https://subete-backend.onrender.com/api/campaigns/by-product?shop=${shop}&product_id=${productId}`
    )
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch((err) => console.error("❌ Error loading campaign:", err));
  }, [shop, productId]);

  // Cargar participantes
  useEffect(() => {
    if (!campaign?.id) return;

    fetch(`https://subete-backend.onrender.com/api/participants?campaign_id=${campaign.id}&shop=${shop}`)
      .then((res) => res.json())
      .then((data) => setParticipants(data))
      .catch((err) => console.error("❌ Error loading participants:", err));
  }, [campaign?.id, shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !campaign?.id || !shop) return;

    setLoading(true);
    setMessage("");

    const res = await fetch("https://subete-backend.onrender.com/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        campaign_id: campaign.id,
        shop,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setMessage("✅ ¡Te uniste exitosamente!");
      setParticipants((prev) => [...prev, { name, email }]);
      setName("");
      setEmail("");
    } else {
      setMessage(`❌ ${result.error}`);
    }

    setLoading(false);
  };

  if (!campaign) return <p className="p-4">No hay campañas activas para este producto.</p>;

  const progress = Math.min((participants.length / campaign.goal) * 100, 100).toFixed(0);

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow bg-white space-y-4">
      <h2 className="text-xl font-bold">{campaign.name}</h2>

      <div>
        <p className="text-sm text-gray-700">
          Participantes: {participants.length} / {campaign.goal}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          Precio regular: <s>$XX.XX</s> {/* puedes reemplazar con el real más adelante */}
        </p>
        <p>
          Precio con campaña:{" "}
          <span className="font-semibold text-green-600">${campaign.discounted_price}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Tu nombre"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Tu correo"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Unirme a esta campaña"}
        </button>
        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
