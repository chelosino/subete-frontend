import { useEffect, useState } from "react";
import CampaignProgress from "../components/CampaignProgress";
import ParticipantsList from "../components/ParticipantsList";
import { supabase } from "../lib/supabaseClient";

export default function Widget() {
  const [participantes, setParticipantes] = useState<any[]>([]);
  const meta = 5;

  useEffect(() => {
    async function fetchParticipantes() {
      const { data, error } = await supabase.from("participants").select("*");

      if (!error && data) {
        setParticipantes(data);
      } else {
        console.error("Error cargando participantes:", error);
      }
    }

    fetchParticipantes();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">🛒 ¡Únete a esta campaña grupal!</h1>
      <CampaignProgress progreso={participantes.length} meta={meta} />
      <ParticipantsList participantes={participantes} />
      <button
        onClick={() => alert("Te uniste (demo)")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Unirme
      </button>
    </div>
  );
}
