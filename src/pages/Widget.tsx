import { useEffect, useState } from "react";
import CampaignProgress from "../components/CampaignProgress";
import ParticipantsList from "../components/ParticipantsList";
import { supabase } from "../lib/supabaseClient";

export default function Widget() {
  const [participantes, setParticipantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const meta = 5;
  const CAMPAIGN_ID = "1a8cbcf6-5b06-460b-b28d-be76bac0a51e"; // reemplazar con ID real


  async function fetchParticipantes() {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("campaign_id", CAMPAIGN_ID);

    if (!error && data) {
      setParticipantes(data);
    } else {
      console.error("❌ Error cargando participantes:", error);
    }
  }

  async function handleUnirme() {
    setLoading(true);

    const nuevo = {
      nombre: `Cliente ${participantes.length + 1}`,
      campaign_id: CAMPAIGN_ID,
    };

    const { error } = await supabase.from("participants").insert(nuevo);

    if (error) {
      console.error("❌ Error al unirse:", error);
    } else {
      await fetchParticipantes(); // volver a cargar
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchParticipantes();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">🛒 ¡Únete a esta campaña grupal!</h1>
      <CampaignProgress progreso={participantes.length} meta={meta} />
      <ParticipantsList participantes={participantes} />
      <button
        onClick={handleUnirme}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Uniéndose..." : "Unirme"}
      </button>
    </div>
  );
}
