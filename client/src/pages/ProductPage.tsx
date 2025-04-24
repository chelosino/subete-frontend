import { useEffect } from "react";
import { useLocation } from "wouter";
import { useCampaignContext } from "@/context/CampaignContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import headphonesImage from "../assets/headphones.png";

const ProductPage = () => {
  const [, setLocation] = useLocation();
  const { createCampaign } = useCampaignContext();

  const handleStartCampaign = () => {
    const campaign = createCampaign();
    setLocation(`/campana/${campaign.id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Banner de demostración del sistema de tracking */}
      <div className="col-span-1 md:col-span-2 p-4 mb-2 border border-blue-200 rounded-lg bg-blue-50">
        <h2 className="text-lg font-bold text-blue-800 mb-2">✨ Demostración del Sistema de Seguimiento</h2>
        <p className="text-blue-700 mb-3">
          Prueba nuestro sistema de seguimiento de compras para ver cómo los usuarios pueden monitorear el progreso de sus campañas grupales.
        </p>
        <Button 
          onClick={() => setLocation('/seguimiento/DEMO-' + Date.now())}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Ver Página de Seguimiento Demo
        </Button>
      </div>
      
      <Card className="overflow-hidden shadow-md">
        <CardContent className="p-0">
          <div className="bg-white h-80 flex items-center justify-center p-4">
            <img 
              src={headphonesImage}
              alt="Audífonos Inalámbricos Premium"
              className="w-full h-full object-contain max-w-[300px]"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Audífonos Inalámbricos Premium
        </h1>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i}
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">(76 reseñas)</span>
          </div>
          <p className="text-gray-600 mb-4">
            Audífonos inalámbricos con cancelación de ruido, batería de larga
            duración y sonido de alta fidelidad. Perfectos para trabajo,
            entretenimiento y deportes.
          </p>

          <ul className="mb-6 space-y-2">
            <li className="flex items-center">
              <Check className="h-5 w-5 text-secondary mr-2" />
              <span>Hasta 30 horas de batería</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-secondary mr-2" />
              <span>Cancelación activa de ruido</span>
            </li>
            <li className="flex items-center">
              <Check className="h-5 w-5 text-secondary mr-2" />
              <span>Bluetooth 5.2, resistentes al agua</span>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="text-2xl font-semibold text-gray-800 line-through mr-2">
              $30
            </span>
            <span className="text-3xl font-bold text-primary">$20</span>
            <span className="ml-2 bg-green-600 text-white text-sm font-medium px-2 py-1 rounded">
              -33%
            </span>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <h3 className="font-medium text-gray-900">
                  ¡Descuento grupal disponible!
                </h3>
                <p className="text-gray-600 mt-1">
                  Inicia una campaña y compra con amigos para desbloquear el
                  precio especial de{" "}
                  <span className="font-semibold text-primary">$20</span> cuando
                  se unan 10 personas.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              onClick={handleStartCampaign}
            >
              Iniciar mi campaña
            </Button>
            <Button 
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-6 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Comprar ahora a $30
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Envío en 24 horas</span>
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Garantía de 1 año</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
