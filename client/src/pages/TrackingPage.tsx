import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CampaignProgress from "@/components/CampaignProgress";
import { Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// Interfaz para almacenar información de seguimiento
interface TrackingInfo {
  trackingId: string;
  campaignId: string;
  productName: string;
  price: number;
  contactInfo: string;
  paymentStatus: "Pendiente" | "Confirmado" | "Reembolsado";
  timestamp: number;
}

// Función para ayudar a simular cambios de estado
const getNextStatus = (current: "Pendiente" | "Confirmado" | "Reembolsado"): "Pendiente" | "Confirmado" | "Reembolsado" => {
  switch (current) {
    case "Pendiente":
      return "Confirmado";
    case "Confirmado":
      return "Reembolsado";
    case "Reembolsado":
      return "Pendiente";
  }
};

// Datos de demostración para la página
const DEMO_TRACKING: TrackingInfo = {
  trackingId: "DEMO123456",
  campaignId: "1",
  productName: "Audífonos Inalámbricos Premium",
  price: 20,
  contactInfo: "usuario@example.com",
  paymentStatus: "Pendiente",
  timestamp: Date.now() - 1000 * 60 * 60 * 3 // 3 horas atrás
};

const DEMO_CAMPAIGN = {
  id: "1",
  productName: "Audífonos Inalámbricos Premium",
  regularPrice: 30,
  groupPrice: 20,
  requiredParticipants: 10,
  currentParticipants: 7,
  createdAt: new Date().toISOString(),
  participants: [
    { id: "p1", name: "Carlos Rodríguez", joinedAt: new Date().toISOString() },
    { id: "p2", name: "Ana López", joinedAt: new Date().toISOString() },
    { id: "p3", name: "Miguel Ángel", joinedAt: new Date().toISOString() },
    { id: "p4", name: "Sofía Martínez", joinedAt: new Date().toISOString() },
    { id: "p5", name: "Juan Pérez", joinedAt: new Date().toISOString() },
    { id: "p6", name: "Lucía García", joinedAt: new Date().toISOString() },
    { id: "p7", name: "Pablo Sánchez", joinedAt: new Date().toISOString() }
  ]
};

const TrackingPage = () => {
  const [match, params] = useRoute<{ trackingId: string }>("/seguimiento/:trackingId");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  // Inicializar directamente con datos de demostración
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo>(DEMO_TRACKING);
  const [campaign, setCampaign] = useState(DEMO_CAMPAIGN);
  const [campaignUrl, setCampaignUrl] = useState(window.location.origin + "/campana/1");

  useEffect(() => {
    // Si hay un ID de seguimiento específico, actualizar el ID de demostración
    if (match && params?.trackingId) {
      setTrackingInfo({
        ...DEMO_TRACKING,
        trackingId: params.trackingId
      });
    }
    
    // Intentar guardar en localStorage para futuras visitas
    try {
      const savedTrackings = localStorage.getItem("trackings") || "[]";
      const trackings = JSON.parse(savedTrackings);
      
      // Comprobar si este tracking ya existe
      if (!trackings.some((t: TrackingInfo) => t.trackingId === trackingInfo.trackingId)) {
        trackings.push(trackingInfo);
        localStorage.setItem("trackings", JSON.stringify(trackings));
      }
      
      // Guardar la campaña de demostración si no existe
      const savedCampaigns = localStorage.getItem("campaigns") || "[]";
      const campaigns = JSON.parse(savedCampaigns);
      
      if (!campaigns.some((c: any) => c.id === campaign.id)) {
        campaigns.push(campaign);
        localStorage.setItem("campaigns", JSON.stringify(campaigns));
      }
    } catch (error) {
      console.error("Error guardando datos en localStorage:", error);
    }
  }, [match, params?.trackingId]);

  const handleCopyLink = () => {
    if (campaignUrl) {
      navigator.clipboard.writeText(campaignUrl).then(() => {
        toast({
          title: "¡Link copiado!",
          description: "El enlace ha sido copiado al portapapeles",
        });
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    }
  };

  // Simulación: cambiar estado del pago para demostración
  const handleTogglePaymentStatus = () => {
    if (!trackingInfo) return;
    
    const newStatus = getNextStatus(trackingInfo.paymentStatus);
    
    // Actualizar el estado localmente
    setTrackingInfo({
      ...trackingInfo,
      paymentStatus: newStatus
    });
    
    // Actualizar en localStorage para persistencia
    const savedTrackings = localStorage.getItem("trackings") || "[]";
    const trackings: TrackingInfo[] = JSON.parse(savedTrackings);
    const updatedTrackings = trackings.map(t => 
      t.trackingId === trackingInfo.trackingId 
        ? { ...t, paymentStatus: newStatus }
        : t
    );
    
    localStorage.setItem("trackings", JSON.stringify(updatedTrackings));
    
    toast({
      title: "Estado actualizado",
      description: `El estado del pago ahora es: ${newStatus}`,
    });
  };

  // Simulación: añadir participante a la campaña
  const handleAddParticipant = () => {
    if (!campaign) return;
    
    // No incrementar si ya está completo
    if (campaign.currentParticipants >= campaign.requiredParticipants) {
      toast({
        title: "Campaña completa",
        description: "La campaña ya alcanzó el número requerido de participantes",
      });
      return;
    }
    
    // Incrementar participantes
    const updatedCampaign = {
      ...campaign,
      currentParticipants: campaign.currentParticipants + 1
    };
    
    setCampaign(updatedCampaign);
    
    // Actualizar en localStorage
    const savedCampaigns = localStorage.getItem("campaigns") || "[]";
    const campaigns = JSON.parse(savedCampaigns);
    const updatedCampaigns = campaigns.map((c: any) => 
      c.id === campaign.id ? updatedCampaign : c
    );
    
    localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
    
    toast({
      title: "¡Nuevo participante!",
      description: `Ahora hay ${updatedCampaign.currentParticipants} de ${updatedCampaign.requiredParticipants} participantes`,
    });
  };

  // Para simular reenvío del link
  const handleResendLink = () => {
    if (!trackingInfo) return;
    
    toast({
      title: "Link reenviado",
      description: `Se ha reenviado el link a ${trackingInfo.contactInfo}`,
    });
  };

  if (!trackingInfo || !campaign) {
    return <div className="text-center py-10">Cargando información de seguimiento...</div>;
  }

  // Función para mostrar la clase correcta según el estado del pago
  const getStatusClassName = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmado":
        return "bg-green-100 text-green-800";
      case "Reembolsado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCampaignComplete = campaign.currentParticipants >= campaign.requiredParticipants;

  // Calcular tiempo restante
  const calculateTimeRemaining = () => {
    // Simular 48 horas desde el timestamp
    const endTime = trackingInfo.timestamp + 48 * 60 * 60 * 1000;
    const now = Date.now();
    const remaining = endTime - now;
    
    if (remaining <= 0) return "Tiempo expirado";
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours} horas ${minutes} minutos`;
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card className="overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Seguimiento de Compra</h1>
          <p className="opacity-90">
            {trackingInfo.productName}
          </p>
        </div>

        <CardContent className="p-6">
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Detalles de tu compra</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(trackingInfo.paymentStatus)}`}>
                  {trackingInfo.paymentStatus}
                </span>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">ID de seguimiento:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {trackingInfo.trackingId}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Producto:</span>
                    <span className="font-medium text-gray-900">{trackingInfo.productName}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Precio pagado:</span>
                    <span className="font-medium text-gray-900">${trackingInfo.price} USD</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fecha de compra:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(trackingInfo.timestamp).toLocaleString()}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Contacto:</span>
                    <span className="font-medium text-gray-900">{trackingInfo.contactInfo}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Progreso de la campaña</h3>
              <CampaignProgress
                current={campaign.currentParticipants}
                required={campaign.requiredParticipants}
              />
              <div className="mt-2 flex justify-between text-sm">
                <div className="text-gray-600">
                  <span className="font-medium text-primary">{campaign.currentParticipants}</span> de {campaign.requiredParticipants} personas
                </div>
                <div className="text-gray-600">
                  Tiempo restante: <span className="font-medium">{calculateTimeRemaining()}</span>
                </div>
              </div>

              {isCampaignComplete ? (
                <div className="mt-4 bg-green-50 border border-green-100 rounded p-3 text-green-800">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">¡Campaña completada con éxito!</span>
                  </div>
                  <p className="mt-1 text-sm">
                    Tu compra será procesada en breve.
                  </p>
                </div>
              ) : (
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded p-3 text-blue-800">
                  <p className="text-sm">
                    Ayuda a completar la campaña compartiendo el enlace con tus amigos.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Comparte esta campaña</h3>
              <p className="text-gray-600 text-sm mb-3">
                Invita a tus amigos a unirse y conseguir el descuento grupal
              </p>
              
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={campaignUrl}
                  className="block w-full pr-24 py-3 px-4 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                />
                <Button
                  className="absolute inset-y-0 right-0 px-4 bg-gray-100 text-gray-700 font-medium rounded-r-lg border-l border-gray-300 hover:bg-gray-200 transition-colors"
                  onClick={handleCopyLink}
                  variant="ghost"
                >
                  Copiar
                </Button>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button className="flex items-center justify-center text-sm font-medium px-3 py-2 rounded-lg bg-[#3b5998] text-white hover:bg-opacity-90 transition-colors">
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
                <Button className="flex items-center justify-center text-sm font-medium px-3 py-2 rounded-lg bg-[#25D366] text-white hover:bg-opacity-90 transition-colors">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={handleResendLink}
              >
                Reenviar link de seguimiento
              </Button>
              <Button
                className="bg-primary"
                onClick={() => navigate(`/campana/${campaign.id}`)}
              >
                Ver campaña completa
              </Button>
              
              {/* Botones de simulación (solo para testing) */}
              <div className="mt-4 border-t pt-4 border-dashed border-gray-200">
                <p className="text-sm text-gray-500 mb-2 italic">Herramientas de simulación:</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1"
                    onClick={handleTogglePaymentStatus}
                  >
                    Cambiar estado de pago
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs flex-1"
                    onClick={handleAddParticipant}
                  >
                    Añadir participante
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackingPage;