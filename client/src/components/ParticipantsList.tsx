import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Participant } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface ParticipantsListProps {
  participants?: Participant[];
}

const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Function to get a random pastel color based on name
  const getColorClass = (name: string) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-red-100 text-red-600",
      "bg-yellow-100 text-yellow-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Manejar el caso en que participants sea undefined
  if (!participants) {
    return (
      <Card className="mt-8 shadow-md">
        <CardHeader className="pb-2">
          <h3 className="font-medium text-gray-900">Personas que se han unido</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="text-gray-500 text-center py-4">
              Cargando participantes...
            </li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 shadow-md">
      <CardHeader className="pb-2">
        <h3 className="font-medium text-gray-900">Personas que se han unido</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {participants.length === 0 ? (
            <li className="text-gray-500 text-center py-4">
              Aún no hay participantes en esta campaña.
            </li>
          ) : (
            participants.map((participant) => (
              <li
                key={participant.id}
                className="flex items-center py-2 border-b border-gray-200 last:border-b-0"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${getColorClass(
                    participant.name
                  )}`}
                >
                  {getInitials(participant.name)}
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-gray-800 font-medium">{participant.name}</p>
                  <p className="text-gray-500 text-sm">
                    Se unió {formatDistanceToNow(new Date(participant.joinedAt), { 
                      addSuffix: true,
                      locale: es
                    })}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;
