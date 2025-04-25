interface Props {
  progreso: number;
  meta: number;
}

export default function CampaignProgress({ progreso, meta }: Props) {
  const porcentaje = (progreso / meta) * 100;

  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="text-sm mt-1 text-center">
        {progreso} de {meta} participantes
      </p>
    </div>
  );
}
