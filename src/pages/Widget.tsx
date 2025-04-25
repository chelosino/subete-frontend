import CampaignProgress from "../components/CampaignProgress";
import ParticipantsList from "../components/ParticipantsList";

export default function Widget() {
  const participantes = [
    { nombre: "Ana" },
    { nombre: "Luis" },
    { nombre: "Carlos" },
  ];

  const progreso = 3; // de 5

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">🛒 ¡Únete a esta campaña grupal!</h1>
      <CampaignProgress progreso={progreso} meta={5} />
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
