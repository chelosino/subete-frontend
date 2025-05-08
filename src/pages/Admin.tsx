import { useState } from "react";

export default function Admin() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(5);
  const [message, setMessage] = useState("");
  const shop = new URLSearchParams(window.location.search).get("shop");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("https://subete-backend.onrender.com/api/create-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, goal, shop }),
    });

    if (res.ok) {
      setMessage("✅ Campaña creada correctamente");
      setName("");
      setGoal(5);
    } else {
      setMessage("❌ Error al crear campaña");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-bold">Crear nueva campaña</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la campaña"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          min={1}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Crear campaña
        </button>
      </form>
      {message && <p className="text-sm mt-2">{message}</p>}
      <a
        href={`/admin/campaigns?shop=${shop}`}
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        Ver campañas existentes
      </a>
    </div>
  );
}
