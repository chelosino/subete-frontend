import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useCampaignContext } from "@/context/CampaignContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlternativeProduct, TrackingInfo } from "@/types";
import { Check, ArrowRight, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Generador de ID único para tracking
const generateTrackingId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9).toUpperCase();
};

const PaymentSuccessPage = () => {
  const [match, params] = useRoute<{ campaignId: string, productId?: string }>("/pago-confirmado/:campaignId/:productId?");
  const [, navigate] = useLocation();
  const { loadCampaign } = useCampaignContext();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<AlternativeProduct | null>(null);
  const [trackingId, setTrackingId] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [trackingUrl, setTrackingUrl] = useState<string>("");
  
  useEffect(() => {
    if (match && params?.campaignId) {
      // Cargar la campaña
      const campaignData = loadCampaign(params.campaignId);
      
      if (campaignData) {
        setCampaign(campaignData);
        
        // Verificar si hay un producto seleccionado en localStorage
        const savedProductStr = localStorage.getItem("selectedProduct");
        if (savedProductStr) {
          try {
            const savedProduct = JSON.parse(savedProductStr);
            setSelectedProduct(savedProduct);
          } catch (error) {
            console.error("Error parsing saved product:", error);
          }
        }
        
        // Generar ID de tracking único (solo si aún no está definido)
        if (!trackingId) {
          const newTrackingId = generateTrackingId();
          setTrackingId(newTrackingId);
          
          // Crear URL de seguimiento
          const baseUrl = window.location.origin;
          setTrackingUrl(`${baseUrl}/seguimiento/${newTrackingId}`);
        }
      } else {
        // Campaña no encontrada, redirigir al inicio
        toast({
          title: "Error",
          description: "No se encontró la campaña",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  // Eliminamos trackingId de las dependencias para evitar bucles infinitos
  }, [match, params, loadCampaign, navigate, toast]);
  
  const handleSubmitContactInfo = () => {
    if (!contactInfo.trim()) {
      toast({
        title: "Información requerida",
        description: "Por favor ingresa tu correo o WhatsApp para recibir actualizaciones",
        variant: "destructive",
      });
      return;
    }
    
    if (!campaign) return;
    
    // Crear objeto de tracking
    const trackingInfo: TrackingInfo = {
      trackingId: trackingId,
      campaignId: campaign.id,
      productName: selectedProduct?.name || campaign.productName,
      price: selectedProduct?.groupPrice || campaign.groupPrice,
      contactInfo: contactInfo,
      paymentStatus: "Pendiente",
      timestamp: Date.now()
    };
    
    // Guardar en localStorage
    const savedTrackings = localStorage.getItem("trackings") || "[]";
    const trackings = JSON.parse(savedTrackings);
    trackings.push(trackingInfo);
    localStorage.setItem("trackings", JSON.stringify(trackings));
    
    // Mostrar mensaje de éxito
    toast({
      title: "¡Información recibida!",
      description: "Te enviaremos actualizaciones sobre el estado de la campaña",
    });
    
    // Redireccionar a la página de seguimiento
    navigate(`/seguimiento/${trackingId}`);
  };
  
  if (!campaign) {
    return <div className="text-center py-10">Cargando información...</div>;
  }
  
  return (
    <div className="max-w-xl mx-auto">
      <Card className="overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
          <div className="rounded-full bg-white w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-1">¡Pago Confirmado!</h1>
          <p className="opacity-90 text-center">Tu reserva ha sido registrada con éxito</p>
        </div>
        
        <CardContent className="p-6">
          <div className="bg-green-50 rounded-lg p-5 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Resumen de tu compra</h2>
            
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M48 16C33.192 16 21.2 27.992 21.2 42.8V53.2C21.2 68.008 33.192 80 48 80C62.808 80 74.8 68.008 74.8 53.2V42.8C74.8 27.992 62.808 16 48 16Z" fill="#EBF4FF" stroke="#3182CE" strokeWidth="2" />
                  <path d="M21.2 48H18.8C16.1909 48 14.2 49.9909 14.2 52.6V60C14.2 62.6091 16.1909 64.6 18.8 64.6H21.2" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
                  <path d="M74.8 48H77.2C79.8091 48 81.8 49.9909 81.8 52.6V60C81.8 62.6091 79.8091 64.6 77.2 64.6H74.8" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
                  <path d="M32 42.8V64" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
                  <path d="M64 42.8V64" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
                  <path d="M32 53.2C32 49.0026 35.4026 45.6 39.6 45.6H56.4C60.5974 45.6 64 49.0026 64 53.2V53.2C64 57.3974 60.5974 60.8 56.4 60.8H39.6C35.4026 60.8 32 57.3974 32 53.2V53.2Z" fill="#FFFFFF" stroke="#3182CE" strokeWidth="2" />
                  <circle cx="37.2" cy="53.2" r="3.2" fill="#3182CE" />
                  <circle cx="58.8" cy="53.2" r="3.2" fill="#3182CE" />
                  <path d="M21.2 48C21.2 36.9543 30.1543 28 41.2 28H54.8C65.8457 28 74.8 36.9543 74.8 48" stroke="#3182CE" strokeWidth="2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900">
                  {selectedProduct?.name || campaign.productName}
                </h3>
                <div className="mt-1">
                  <span className="font-semibold text-green-700">${selectedProduct?.groupPrice || campaign.groupPrice} USD</span>
                  <span className="ml-1 text-gray-500 text-sm">
                    (Precio normal: ${selectedProduct?.regularPrice || campaign.regularPrice} USD)
                  </span>
                </div>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between py-1">
                <span className="text-gray-600">ID de Transacción:</span>
                <span className="font-mono text-xs bg-white px-2 py-1 rounded border">{trackingId}</span>
              </li>
              <li className="flex justify-between border-t border-green-100 pt-2">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-xs">
                  Pendiente de completar grupo
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Participantes actuales:</span>
                <span className="font-medium">{campaign.currentParticipants} de {campaign.requiredParticipants}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Tiempo restante:</span>
                <span className="font-medium">47 horas 53 minutos</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">¿Dónde quieres recibir el link de seguimiento?</h2>
            <div className="mb-4">
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                Email o WhatsApp
              </label>
              <input
                type="text"
                id="contactInfo"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="tu@email.com o +1234567890"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                Te enviaremos actualizaciones sobre el estado de esta campaña
              </p>
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-blue-600"
              onClick={handleSubmitContactInfo}
            >
              Recibir link de seguimiento
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-400" />
              <h3 className="text-gray-700 font-medium">Información importante</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p className="mb-2">
                <strong className="font-medium">¿Qué sigue ahora?</strong> Necesitamos alcanzar {campaign.requiredParticipants} participantes para activar el descuento grupal.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Si se completa: procesaremos tu pago y enviaremos tu producto al precio reducido.</li>
                <li>Si no se completa: te reembolsaremos automáticamente o tendrás la opción de comprar al precio normal.</li>
                <li>Te mantendremos informado por email/WhatsApp sobre el progreso.</li>
              </ul>
              <p className="mt-2">
                Puedes compartir esta campaña con amigos para aumentar las probabilidades de completar el grupo.
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline"
              className="mr-2"
              onClick={() => navigate(`/campana/${campaign.id}`)}
            >
              Volver a la campaña
            </Button>
            <Button onClick={() => navigate("/")}>
              Ir al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;