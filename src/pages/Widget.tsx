import { useEffect, useState } from "react";
import CampaignProgress from "../components/CampaignProgress";
import ParticipantsList from "../components/ParticipantsList";
import { supabase } from "../lib/supabaseClient";

// 👇 Reemplazá esto con el ID real de tu campaña en Supabase
const CAMPAIGN_ID = "1a8cbcf6-5b06-460b-b28d-be76bac0a51e";

export default function Widget() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState(5); // valor por defecto

  async function fetchParticipants() {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("campaign_id", CAMPAIGN_ID);

    if (!error && data) {
      setParticipants(data);
    } else {
      console.error("❌ Error cargando participantes:", error);
    }
  }

  async function fetchCampaign() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", CAMPAIGN_ID)
      .single();

    if (!error && data) {
      setGoal(data.goal || 5);
    } else {
      console.error("❌ Error cargando campaña:", error);
    }
  }

  async function handleJoin() {
    setLoading(true);

    const newClient = {
      name: `Cliente ${participants.length + 1}`,
      campaign_id: CAMPAIGN_ID,
    };

    const { error } = await supabase.from("participants").insert(newClient);

    if (error) {
      console.error("❌ Error al unirse:", error);
    } else {
      await fetchParticipants();
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchCampaign();
    fetchParticipants();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">🛒 ¡Únete a esta campaña grupal!</h1>
      <CampaignProgress progreso={participants.length} meta={goal} />
      <ParticipantsList participantes={participants} />
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Uniéndose..." : "Unirme"}
      </button>
    </div>
  );
}
