interface Props {
  participantes: { nombre: string }[];
}

export default function ParticipantsList({ participantes }: Props) {
  return (
    <ul className="text-sm text-gray-700 space-y-1">
      {participantes.map((p, idx) => (
        <li key={idx}>👤 {p.nombre}</li>
      ))}
    </ul>
  );
}
