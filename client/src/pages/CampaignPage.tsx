import { useEffect, useState, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useCampaignContext } from "@/context/CampaignContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CampaignProgress from "@/components/CampaignProgress";
import ParticipantsList from "@/components/ParticipantsList";
import { Check, Facebook, Instagram, Twitter } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";
import { AlternativeProduct } from "@/types";
import headphonesImage from "../assets/headphones.png";

// Productos disponibles para la campaña
const alternativeProducts: AlternativeProduct[] = [
  {
    id: 1,
    name: "Audífonos Inalámbricos Premium",
    regularPrice: 30,
    groupPrice: 20,
    image: "headphones"
  },
  {
    id: 2,
    name: "Smartwatch Fitness Tracker",
    regularPrice: 70,
    groupPrice: 50,
    image: "watch"
  },
  {
    id: 3,
    name: "Parlante Bluetooth Portátil",
    regularPrice: 45,
    groupPrice: 30,
    image: "speaker"
  },
  {
    id: 4,
    name: "Power Bank 10000mAh",
    regularPrice: 25,
    groupPrice: 15,
    image: "powerbank"
  }
];

// Función para renderizar las imágenes de productos según su tipo
const renderProductImage = (imageName: string) => {
  switch (imageName) {
    case "headphones":
      return (
        <img 
          src={headphonesImage} 
          alt="Audífonos Inalámbricos Premium" 
          className="w-full h-full object-contain"
        />
      );
    case "watch":
      return (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="34" y="24" width="28" height="48" rx="6" fill="#EBF4FF" stroke="#3182CE" strokeWidth="2" />
          <rect x="38" y="32" width="20" height="32" rx="2" fill="#FFFFFF" stroke="#3182CE" strokeWidth="2" />
          <path d="M34 36C30 36 26 32 26 28" stroke="#3182CE" strokeWidth="2" />
          <path d="M34 60C30 60 26 64 26 68" stroke="#3182CE" strokeWidth="2" />
          <path d="M62 36C66 36 70 32 70 28" stroke="#3182CE" strokeWidth="2" />
          <path d="M62 60C66 60 70 64 70 68" stroke="#3182CE" strokeWidth="2" />
          <circle cx="48" cy="48" r="4" fill="#3182CE" />
          <path d="M48 38V48L54 52" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "speaker":
      return (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="28" y="24" width="40" height="48" rx="4" fill="#EBF4FF" stroke="#3182CE" strokeWidth="2" />
          <circle cx="48" cy="40" r="8" fill="#FFFFFF" stroke="#3182CE" strokeWidth="2" />
          <circle cx="48" cy="40" r="4" fill="#3182CE" />
          <circle cx="48" cy="64" r="6" fill="#FFFFFF" stroke="#3182CE" strokeWidth="2" />
          <circle cx="48" cy="64" r="2" fill="#3182CE" />
          <path d="M38 28H58" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 34H60" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 46H60" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M38 52H58" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 58H56" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "powerbank":
      return (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="24" y="32" width="48" height="32" rx="4" fill="#EBF4FF" stroke="#3182CE" strokeWidth="2" />
          <rect x="28" y="36" width="40" height="24" rx="2" fill="#FFFFFF" stroke="#3182CE" strokeWidth="2" />
          <circle cx="34" cy="48" r="4" fill="#3182CE" />
          <path d="M42 44H64" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 48H64" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 52H64" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M72 44H76V52H72" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="24" y="24" width="48" height="48" rx="4" fill="#EBF4FF" stroke="#3182CE" strokeWidth="2" />
          <path d="M36 36H60" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 48H60" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
          <path d="M36 60H60" stroke="#3182CE" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
};

const CampaignPage = () => {
  const [match, params] = useRoute<{ id: string }>("/campana/:id");
  const [, navigate] = useLocation();
  const { loadCampaign, activeCampaign, joinCampaign } = useCampaignContext();
  const [campaignUrl, setCampaignUrl] = useState("");
  const { toast } = useToast();
  
  // Estado para el producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState<AlternativeProduct | null>(null);
  
  // Estado para mostrar/ocultar la sección de productos alternativos
  const [showAlternativeProducts, setShowAlternativeProducts] = useState(true);
  
  // Estado para mostrar/ocultar las herramientas de demostración
  const [showDemoTools, setShowDemoTools] = useState(false);
  
  // Efecto para cargar la campaña - usamos useRef para evitar el bucle infinito
  const campaignIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (match && params?.id && (campaignIdRef.current !== params.id)) {
      campaignIdRef.current = params.id;
      loadCampaign(params.id);
      setCampaignUrl(window.location.href);
    }
  }, [match, params]);
  
  // Efecto para inicializar el producto seleccionado
  useEffect(() => {
    if (activeCampaign && !selectedProduct) {
      // Buscar el producto en el array por nombre
      const defaultProduct = alternativeProducts.find(p => p.name === activeCampaign.productName);
      setSelectedProduct(defaultProduct || alternativeProducts[0]);
    }
  }, [activeCampaign]);

  const handleCopyLink = () => {
    if (campaignUrl) {
      navigator.clipboard.writeText(campaignUrl).then(() => {
        toast({
          title: "¡Link copiado!",
          description: "El enlace ha sido copiado al portapapeles"
        });
      }).catch(err => {
        console.error('Error copying to clipboard:', err);
      });
    }
  };
  
  const handleShareCampaign = (platform: string) => {
    if (!campaignUrl || !activeCampaign) return;
    
    const message = `¡Únete a nuestra campaña grupal para obtener un ${Math.round((1 - activeCampaign.groupPrice / activeCampaign.regularPrice) * 100)}% de descuento en ${activeCampaign.productName}!`;
    
    switch (platform) {
      case 'facebook':
        // Compartir en Facebook
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(campaignUrl)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      
      case 'whatsapp':
        // Compartir en WhatsApp
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + campaignUrl)}`, '_blank');
        break;
      
      case 'instagram':
        // Instagram no permite compartir directamente vía URL, pero podemos abrir Instagram
        navigator.clipboard.writeText(campaignUrl);
        toast({
          title: "Compartir en Instagram",
          description: "Abre Instagram y pega el enlace que ha sido copiado a tu portapapeles.",
        });
        window.open('https://www.instagram.com/', '_blank');
        break;
      
      case 'twitter':
        // Compartir en X (Twitter)
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(campaignUrl)}`, '_blank');
        break;
      
      default:
        handleCopyLink();
    }
  };

  const handleJoinCampaign = () => {
    if (activeCampaign) {
      joinCampaign(activeCampaign.id);
    }
  };

  if (!activeCampaign) {
    return <div className="text-center py-10">Cargando campaña...</div>;
  }

  const isCampaignComplete = activeCampaign.currentParticipants >= activeCampaign.requiredParticipants;
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">Campaña de Descuento Grupal</h1>
          <p className="opacity-90">{activeCampaign.productName}</p>
        </div>
        
        <CardContent className="p-6">
          <CampaignProgress 
            current={activeCampaign.currentParticipants} 
            required={activeCampaign.requiredParticipants} 
          />

          {/* Resumen de la campaña */}
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center p-1">
              <img 
                src={headphonesImage} 
                alt="Audífonos Inalámbricos Premium" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-lg text-gray-900">
                {activeCampaign.productName}
              </h2>
              <div className="flex items-center mt-1">
                <span className="text-lg font-semibold text-gray-800 line-through mr-2">
                  ${activeCampaign.regularPrice} USD
                </span>
                <span className="text-xl font-bold text-primary">
                  ${activeCampaign.groupPrice} USD
                </span>
                <span className="ml-2 bg-green-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                  -{Math.round((1 - activeCampaign.groupPrice / activeCampaign.regularPrice) * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Detalles del producto y campaña */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Resumen de la campaña</h3>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Producto:</span>
                  <span className="font-medium text-gray-900">{activeCampaign.productName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Precio grupal:</span>
                  <span className="font-medium text-gray-900">${activeCampaign.groupPrice} USD</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Precio normal:</span>
                  <span className="font-medium text-gray-900">${activeCampaign.regularPrice} USD</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Personas necesarias:</span>
                  <span className="font-medium text-gray-900">{activeCampaign.requiredParticipants}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Personas unidas:</span>
                  <span className="font-medium text-gray-900">{activeCampaign.currentParticipants}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tiempo restante:</span>
                  <span className="font-medium text-gray-900">47 horas 53 minutos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Productos alternativos */}
          <div className={`bg-white border border-gray-200 rounded-lg shadow-sm mb-6 ${!showAlternativeProducts ? 'hidden' : ''}`}>
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">¿Prefieres otro producto?</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4">
                Puedes elegir otro producto y unirte a la misma campaña grupal. Todos los productos suman al mismo contador para alcanzar el descuento.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {alternativeProducts.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`
                      flex items-center p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedProduct?.id === product.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {renderProductImage(product.image)}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span className="text-xs font-medium text-gray-600 line-through mr-1">
                          ${product.regularPrice}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          ${product.groupPrice}
                        </span>
                        <span className="ml-1 bg-green-600 text-white text-xs px-1 py-0.5 rounded text-[10px]">
                          -{Math.round((1 - product.groupPrice / product.regularPrice) * 100)}%
                        </span>
                      </div>
                    </div>
                    {selectedProduct?.id === product.id && (
                      <div className="ml-2 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explicación del funcionamiento */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-6">
            <div className="flex items-start mb-3">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-2 text-lg font-semibold text-gray-900">¿Cómo funciona esta compra?</h3>
            </div>
            
            <p className="mb-4 font-medium text-gray-800">
              ✅ Hoy pagarás <span className="font-bold text-primary">${selectedProduct?.groupPrice || activeCampaign.groupPrice} USD</span> para reservar tu cupo en esta campaña.
            </p>
            
            <div className="bg-white rounded-lg border border-blue-100 p-4 mb-3">
              <h4 className="flex items-center text-gray-900 font-medium mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Tu pago está protegido:
              </h4>
              <ul className="space-y-2 pl-6">
                <li className="text-gray-700 list-disc">
                  Si se juntan las {activeCampaign.requiredParticipants} personas dentro de 48 horas, se activará el descuento y se procesará tu compra.
                </li>
                <li className="text-gray-700 list-disc">
                  Si no se alcanza el objetivo, te <span className="font-medium">reembolsaremos automáticamente</span>.
                </li>
                <li className="text-gray-700 list-disc">
                  También podrás elegir <span className="font-medium">comprar el producto al precio normal</span> si lo prefieres.
                </li>
              </ul>
            </div>
          </div>

          {/* Opciones de compartir */}
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
            
            <p className="text-gray-600 text-xs mt-3 mb-1">Compartir en redes sociales:</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => handleShareCampaign('facebook')}
                size="sm"
                className="flex items-center justify-center text-xs h-7 px-2 bg-[#3b5998] text-white hover:bg-[#324b81] transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px]">Facebook</span>
              </Button>
              <Button 
                onClick={() => handleShareCampaign('whatsapp')}
                size="sm"
                className="flex items-center justify-center text-xs h-7 px-2 bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors"
              >
                <FaWhatsapp className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px]">WhatsApp</span>
              </Button>
              <Button 
                onClick={() => handleShareCampaign('instagram')}
                size="sm"
                className="flex items-center justify-center text-xs h-7 px-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 transition-opacity"
              >
                <Instagram className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px]">Instagram</span>
              </Button>
              <Button 
                onClick={() => handleShareCampaign('twitter')}
                size="sm"
                className="flex items-center justify-center text-xs h-7 px-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <FaXTwitter className="w-3.5 h-3.5 mr-1" />
                <span className="text-[10px]">X</span>
              </Button>
            </div>
          </div>

          {/* Checkbox de términos y condiciones */}
          <div className="flex items-center mb-6">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              Acepto las condiciones de esta campaña y la <a href="#" className="text-primary hover:text-blue-600">política de privacidad</a>
            </label>
          </div>

          {/* Botón de acción */}
          <div className="grid grid-cols-1 gap-4">
            {!isCampaignComplete && (
              <Button
                className="bg-primary hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors text-lg"
                onClick={() => {
                  // Guardar el producto seleccionado en localStorage
                  if (selectedProduct) {
                    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
                  }
                  
                  // Simular procesamiento del pago
                  alert(`Simulación: Procesando pago de $${selectedProduct?.groupPrice || activeCampaign.groupPrice} USD para ${selectedProduct?.name || activeCampaign.productName}`);
                  
                  // Unirse a la campaña
                  handleJoinCampaign();
                  
                  // Redireccionar a la página de confirmación de pago
                  const productIdParam = selectedProduct ? `/${selectedProduct.id}` : '';
                  navigate(`/pago-confirmado/${activeCampaign.id}${productIdParam}`);
                }}
              >
                Pagar ${selectedProduct?.groupPrice || activeCampaign.groupPrice} y unirme al carro
              </Button>
            )}
            
            {isCampaignComplete && (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors text-lg"
                onClick={() => alert(`Simulación: Procesando compra final a $${selectedProduct?.groupPrice || activeCampaign.groupPrice} USD para ${selectedProduct?.name || activeCampaign.productName}`)}
              >
                Finalizar mi compra a ${selectedProduct?.groupPrice || activeCampaign.groupPrice} USD
              </Button>
            )}
          </div>
          
          {/* Métodos de pago y seguridad */}
          <div className="mt-6 flex items-center justify-center">
            <div className="flex space-x-3 items-center text-gray-500 text-sm">
              <span>Métodos de pago seguros:</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 13H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1h16c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1h-6v2h2c.6 0 1 .4 1 1v2c0 .6-.4 1-1 1h-2v2c0 .6-.4 1-1 1h-2c-.6 0-1-.4-1-1v-2H7c-.6 0-1-.4-1-1v-2c0-.6.4-1 1-1h3v-2z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.1 13.3c0-1.2 1-2.2 2.2-2.2h15.4c1.2 0 2.2 1 2.2 2.2v4.4c0 1.2-1 2.2-2.2 2.2H4.3c-1.2 0-2.2-1-2.2-2.2v-4.4zm19.9-6.6c0 1.2-1 2.2-2.2 2.2H4.3c-1.2 0-2.2-1-2.2-2.2V4.3c0-1.2 1-2.2 2.2-2.2h15.4c1.2 0 2.2 1 2.2 2.2v2.4z"/>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8H7c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6H7v-4h10v4z"/>
                <path d="M12 16.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"/>
              </svg>
            </div>
          </div>
          
          {/* Herramientas de demostración */}
          <div className="mt-8 border-t pt-5 border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <p className="text-gray-500 text-sm font-medium">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Herramientas de demostración
                </span>
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  console.log('INFO: Toggling demo tools visibility');
                  setShowDemoTools(!showDemoTools);
                }}
              >
                {showDemoTools ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            
            {showDemoTools && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Estas herramientas son solo para fines de demostración y presentación.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Mostrar sección "¿Prefieres otro producto?"
                    </label>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer ${showAlternativeProducts ? 'bg-primary' : 'bg-gray-200'}`}
                      onClick={() => {
                        console.log(`INFO: Toggling alternative products visibility from ${showAlternativeProducts} to ${!showAlternativeProducts}`);
                        setShowAlternativeProducts(!showAlternativeProducts);
                      }}
                    >
                      <span
                        className={`${
                          showAlternativeProducts ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Simular campaña completa
                    </label>
                    <div 
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer ${isCampaignComplete ? 'bg-primary' : 'bg-gray-200'}`}
                      onClick={() => {
                        console.log('INFO: Simulating campaign completion toggle');
                        try {
                          // Aquí se simularía completar la campaña
                          if (!isCampaignComplete) {
                            if (activeCampaign) {
                              console.log('INFO: Attempting to complete campaign by adding participants');
                              const missingParticipants = activeCampaign.requiredParticipants - activeCampaign.currentParticipants;
                              for (let i = 0; i < missingParticipants; i++) {
                                handleJoinCampaign();
                              }
                              console.log('SUCCESS: Campaign completed successfully');
                              toast({
                                title: "¡Campaña completada!",
                                description: "Has simulado completar la campaña añadiendo participantes",
                              });
                            } else {
                              console.error('ERROR: Active campaign is null or undefined');
                            }
                          } else {
                            console.log('INFO: Campaign is already complete, no action needed');
                          }
                        } catch (error) {
                          console.error('ERROR: Failed to simulate campaign completion', error);
                          toast({
                            title: "Error al simular",
                            description: "No se pudo completar la simulación",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <span
                        className={`${
                          isCampaignComplete ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Aseguramos que activeCampaign esté definido antes de acceder a participants */}
      <ParticipantsList participants={activeCampaign?.participants} />
    </div>
  );
};

export default CampaignPage;
