import { useState } from "react";

export default function Admin() {
  const shop = new URLSearchParams(window.location.search).get("shop");

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [productId, setProductId] = useState("");
  const [discount, setDiscount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{ id: string; title: string }[]>([]);

  const fetchProducts = async () => {
    if (!shop || !search) return;

    const res = await fetch(
      `https://subete-backend.onrender.com/api/products?shop=${shop}&query=${encodeURIComponent(search)}`
    );

    const data = await res.json();
    setResults(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return alert("Falta parámetro 'shop'");

    setLoading(true);
    setMessage("");

    const res = await fetch("https://subete-backend.onrender.com/api/create-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        goal: parseInt(goal),
        product_id: productId,
        discount_percentage: parseFloat(discount),
        shop,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("✅ Campaña creada correctamente");
      setName("");
      setGoal("");
      setProductId("");
      setDiscount("");
    } else {
      setMessage(`❌ ${data.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6 p-4 border rounded shadow bg-white">
      <h1 className="text-xl font-bold">🎯 Crear nueva campaña</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre de la campaña"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Meta de participantes"
          className="w-full p-2 border rounded"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setTimeout(fetchProducts, 300);
          }}
        />
        <ul className="border max-h-40 overflow-y-auto bg-white rounded">
          {results.map((p) => (
            <li
              key={p.id}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                setProductId(p.id.toString());
                setSearch(p.title);
                setResults([]);
              }}
            >
              {p.title}
            </li>
          ))}
        </ul>
        <input
          type="number"
          placeholder="Descuento (%)"
          className="w-full p-2 border rounded"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear campaña"}
        </button>
      </form>

      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  );
}
