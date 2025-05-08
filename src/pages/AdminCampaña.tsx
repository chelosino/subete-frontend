import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Participant {
  id: string;
  nombre: string;
  created_at: string;
}

export default function AdminCampaña() {
  const { id } = useParams();
  const shop = new URLSearchParams(window.location.search).get("shop");
  const [participantes, setParticipantes] = useState<Participant[]>([]);
  const [campaña, setCampaña] = useState<any>(null);

  useEffect(() => {
    if (!id || !shop) return;

    fetch(`https://subete-backend.onrender.com/api/campaigns/${id}?shop=${shop}`)
      .then((res) => res.json())
      .then((data) => setCampaña(data))
      .catch((err) => console.error(err));

    fetch(`https://subete-backend.onrender.com/api/participants?campaign_id=${id}`)
      .then((res) => res.json())
      .then((data) => setParticipantes(data))
      .catch((err) => console.error(err));
  }, [id, shop]);

  if (!campaña) return <p>Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">{campaña.nombre}</h1>
      <p>Meta: {campaña.meta}</p>

      <h2 className="text-xl font-semibold mt-4">👥 Participantes</h2>
      {participantes.length === 0 ? (
        <p className="text-gray-600">No hay participantes aún.</p>
      ) : (
        <ul className="list-disc pl-6">
          {participantes.map((p) => (
            <li key={p.id}>{p.nombre}</li>
          ))}
        </ul>
      )}
      <a
        href={`/admin?shop=${shop}`}
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        + Crear nueva campaña
      </a>
      <a
        href={`/admin/campañas?shop=${shop}`}
        className="inline-block text-blue-600 hover:underline mt-6"
      >
        ← Volver al listado
      </a>
    </div>
  );
}
