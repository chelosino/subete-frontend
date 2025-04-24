import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface CampaignProgressProps {
  current: number;
  required: number;
}

const CampaignProgress = ({ current, required }: CampaignProgressProps) => {
  const progress = (current / required) * 100;
  const isComplete = current >= required;
  const remaining = Math.max(0, required - current);

  return (
    <div className="bg-blue-50 rounded-lg p-4 mb-6">
      {!isComplete ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Progreso de la campaña</span>
            <span className="text-primary font-medium">
              {current} de {required} personas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-primary rounded-full h-4"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <p className="text-gray-600 text-sm">
            Necesitamos <span className="font-medium">{remaining} personas más</span> para
            desbloquear el precio especial de <span className="font-medium text-primary">$20</span> (normal
            $30).
          </p>
        </div>
      ) : (
        <div className="flex items-center">
          <Check className="h-8 w-8 text-secondary mr-3" />
          <div>
            <h3 className="font-bold text-secondary text-lg">¡Descuento desbloqueado!</h3>
            <p className="text-gray-600">
              ¡Felicidades! Han alcanzado el mínimo de {required} personas. El precio especial de $20 ya está
              disponible para todos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignProgress;
