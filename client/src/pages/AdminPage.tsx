import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useCampaignContext } from "@/context/CampaignContext";
import { Campaign, CampaignFormInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Edit, Trash2, Copy, Play, Pause, Clock, 
  Eye, Share2, BarChart3, Download, Plus, 
  ChevronRight, ChevronLeft, Users, ShoppingBag, DollarSign, 
  Instagram, Twitter, Facebook, RefreshCw
} from "lucide-react";
import { FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { logInfo, logWarning, logError } from "@/utils/logger";
import headphonesImage from "../assets/headphones.png";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Componente para renderizar el estado de la campaña
const CampaignStatusBadge = ({ status }: { status?: string }) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Activa</Badge>;
    case 'paused':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pausada</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completada</Badge>;
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Expirada</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Desconocido</Badge>;
  }
};

// Componente para crear/editar campaña
const CampaignForm = ({ 
  onSubmit, 
  initialData, 
  onCancel 
}: { 
  onSubmit: (data: CampaignFormInput) => void; 
  initialData?: Campaign; 
  onCancel: () => void;
}) => {
  const tomorrow = addDays(new Date(), 2);
  const defaultExpiryDate = format(tomorrow, "yyyy-MM-dd'T'HH:mm");
  
  const [formData, setFormData] = useState<CampaignFormInput>({
    productName: initialData?.productName || "Audífonos Inalámbricos Premium",
    description: initialData?.description || "Audífonos inalámbricos con cancelación de ruido, batería de larga duración y sonido de alta fidelidad.",
    regularPrice: initialData?.regularPrice || 30,
    groupPrice: initialData?.groupPrice || 20,
    requiredParticipants: initialData?.requiredParticipants || 10,
    expiresAt: initialData?.expiresAt || defaultExpiryDate,
    category: initialData?.category || "Audio"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'regularPrice' || name === 'groupPrice' || name === 'requiredParticipants' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Nombre del producto</Label>
          <Input 
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleSelectChange(value, 'category')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Audio">Audio</SelectItem>
              <SelectItem value="Electrónica">Electrónica</SelectItem>
              <SelectItem value="Accesorios">Accesorios</SelectItem>
              <SelectItem value="Smartwatches">Smartwatches</SelectItem>
              <SelectItem value="Otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regularPrice">Precio normal ($)</Label>
          <Input 
            id="regularPrice"
            name="regularPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.regularPrice}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="groupPrice">Precio grupal ($)</Label>
          <Input 
            id="groupPrice"
            name="groupPrice"
            type="number"
            step="0.01" 
            min="0"
            value={formData.groupPrice}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="requiredParticipants">Participantes necesarios</Label>
          <Input 
            id="requiredParticipants"
            name="requiredParticipants"
            type="number" 
            min="2"
            value={formData.requiredParticipants}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Fecha de vencimiento</Label>
        <Input 
          id="expiresAt"
          name="expiresAt"
          type="datetime-local" 
          value={formData.expiresAt}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Actualizar campaña' : 'Crear campaña'}
        </Button>
      </div>
    </form>
  );
};

const AdminPage = () => {
  const { 
    getAllCampaigns, 
    campaigns, 
    createCampaignWithParams, 
    updateCampaign, 
    duplicateCampaign, 
    changeCampaignStatus,
    removeCampaign
  } = useCampaignContext();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignStats, setCampaignStats] = useState<{
    total: number;
    active: number;
    completed: number;
    other: number;
  }>({ total: 0, active: 0, completed: 0, other: 0 });

  // Usar React Query para obtener campañas, pero sin refresco automático para evitar bucles infinitos
  const { data: apiCampaigns, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/campaigns'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/campaigns");
        const data = await response.json();
        logInfo(`Retrieved ${data.length} campaigns from API`, 'AdminPage');
        return data;
      } catch (error) {
        logError(`Failed to fetch campaigns from API: ${error}`, 'AdminPage');
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity, // No considerar los datos obsoletos
    refetchInterval: false, // No hacer refresco automático
  });

  // Combinar datos de la API con los guardados localmente
  useEffect(() => {
    if (apiCampaigns) {
      // Actualizar la caché del contexto
      apiCampaigns.forEach(campaign => {
        queryClient.setQueryData([`/api/campaigns/${campaign.id}`], campaign);
      });
      // Solo llamar a getAllCampaigns() una vez cuando se monta el componente o cuando hay un error
    } else if (isError) {
      // Cargar campañas desde localStorage si la API falla
      getAllCampaigns();
    }
  }, [isError, apiCampaigns]);

  useEffect(() => {
    // Calcular estadísticas
    const displayedCampaigns = apiCampaigns || campaigns;
    const stats = {
      total: displayedCampaigns.length,
      active: displayedCampaigns.filter(c => c.status === 'active').length,
      completed: displayedCampaigns.filter(c => c.status === 'completed').length,
      other: displayedCampaigns.filter(c => c.status !== 'active' && c.status !== 'completed').length
    };
    setCampaignStats(stats);
    
    logInfo('Campaign statistics calculated', 'AdminPage', stats);
  }, [campaigns, apiCampaigns]);

  // Agregar refresco controlado cada 30 segundos
  const [nextRefreshIn, setNextRefreshIn] = useState(30);
  
  useEffect(() => {
    // Configurar un intervalo para refrescar los datos cada 30 segundos
    const intervalId = setInterval(() => {
      refetch();
      setNextRefreshIn(30); // Reiniciar contador
    }, 30000);
    
    // Actualizar contador cada segundo
    const countdownId = setInterval(() => {
      setNextRefreshIn(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    // Limpiar intervalos cuando el componente se desmonte
    return () => {
      clearInterval(intervalId);
      clearInterval(countdownId);
    };
  }, [refetch]);
  
  // Forzar una recarga de campañas
  const handleRefresh = () => {
    refetch();
    getAllCampaigns();
    setNextRefreshIn(30); // Reiniciar contador
    toast({
      title: "Actualizando",
      description: "Recuperando las campañas más recientes...",
    });
  };

  const handleCreateCampaign = (data: CampaignFormInput) => {
    try {
      const newCampaign = createCampaignWithParams(data);
      logInfo('Campaign created successfully', 'AdminPage', { campaignId: newCampaign.id });
      toast({
        title: "Campaña creada",
        description: `La campaña ${data.productName} ha sido creada exitosamente.`,
      });
      setIsCreateDialogOpen(false);
      
      // Hacer una recarga explícita tras 1 segundo para dar tiempo a que se complete
      // la creación en la base de datos
      setTimeout(() => {
        refetch();
        getAllCampaigns();
      }, 1000);
    } catch (error) {
      logError(`Failed to create campaign: ${error}`, 'AdminPage');
      toast({
        title: "Error",
        description: "No se pudo crear la campaña. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditCampaign = (data: CampaignFormInput) => {
    if (!selectedCampaign) return;
    
    try {
      const updatedCampaign = updateCampaign(selectedCampaign.id, data);
      
      if (updatedCampaign) {
        logInfo('Campaign updated successfully', 'AdminPage', { 
          campaignId: updatedCampaign.id, 
          newData: data 
        });
        toast({
          title: "Campaña actualizada",
          description: `La campaña ${data.productName} ha sido actualizada exitosamente.`,
        });
      } else {
        throw new Error("No se pudo actualizar la campaña");
      }
      
      setIsEditDialogOpen(false);
      setSelectedCampaign(null);
      
      // Actualizar después de editar
      setTimeout(() => {
        refetch();
        getAllCampaigns();
      }, 1000);
    } catch (error) {
      logError(`Failed to update campaign: ${error}`, 'AdminPage');
      toast({
        title: "Error",
        description: "No se pudo actualizar la campaña. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    try {
      const duplicate = duplicateCampaign(campaign.id);
      if (duplicate) {
        logInfo('Campaign duplicated successfully', 'AdminPage', {
          originalId: campaign.id,
          newId: duplicate.id
        });
        toast({
          title: "Campaña duplicada",
          description: `Se ha creado una copia de la campaña ${campaign.productName}.`,
        });
        
        // Actualizar después de duplicar
        setTimeout(() => {
          refetch();
          getAllCampaigns();
        }, 1000);
      } else {
        throw new Error("No se pudo duplicar la campaña");
      }
    } catch (error) {
      logError(`Failed to duplicate campaign: ${error}`, 'AdminPage');
      toast({
        title: "Error",
        description: "No se pudo duplicar la campaña. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = (campaign: Campaign) => {
    try {
      // Si está activa, pausarla; si está pausada, activarla
      const newStatus = campaign.status === 'active' ? 'paused' : 'active';
      const updated = changeCampaignStatus(campaign.id, newStatus);
      
      if (updated) {
        logInfo(`Campaign status changed to ${newStatus}`, 'AdminPage', {
          campaignId: campaign.id
        });
        toast({
          title: "Estado actualizado",
          description: `La campaña ahora está ${newStatus === 'active' ? 'activa' : 'pausada'}.`,
        });
        
        // Actualizar después de cambiar estado
        setTimeout(() => {
          refetch();
          getAllCampaigns();
        }, 1000);
      } else {
        throw new Error("No se pudo cambiar el estado de la campaña");
      }
    } catch (error) {
      logError(`Failed to change campaign status: ${error}`, 'AdminPage');
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de la campaña. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    if (window.confirm(`¿Está seguro que desea eliminar la campaña "${campaign.productName}"?`)) {
      try {
        const success = removeCampaign(campaign.id);
        
        if (success) {
          logInfo('Campaign deleted successfully', 'AdminPage', {
            campaignId: campaign.id
          });
          toast({
            title: "Campaña eliminada",
            description: "La campaña ha sido eliminada exitosamente.",
          });
          
          // Actualizar después de eliminar
          setTimeout(() => {
            refetch();
            getAllCampaigns();
          }, 1000);
        } else {
          throw new Error("No se pudo eliminar la campaña");
        }
      } catch (error) {
        logError(`Failed to delete campaign: ${error}`, 'AdminPage');
        toast({
          title: "Error",
          description: "No se pudo eliminar la campaña. Intente nuevamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShareCampaign = (campaign: Campaign, platform?: string) => {
    const url = `${window.location.origin}/campana/${campaign.id}`;
    const message = `¡Únete a nuestra campaña grupal para obtener un ${Math.round((1 - campaign.groupPrice / campaign.regularPrice) * 100)}% de descuento en ${campaign.productName}!`;
    
    // Compartir según la plataforma elegida
    switch (platform) {
      case 'facebook':
        // Compartir en Facebook
        logInfo('Sharing campaign to Facebook', 'AdminPage', { campaignId: campaign.id });
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      
      case 'whatsapp':
        // Compartir en WhatsApp
        logInfo('Sharing campaign to WhatsApp', 'AdminPage', { campaignId: campaign.id });
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
        break;
        
      case 'instagram':
        // Instagram no permite compartir directamente vía URL, pero podemos abrir Instagram
        logInfo('Sharing campaign to Instagram', 'AdminPage', { campaignId: campaign.id });
        toast({
          title: "Compartir en Instagram",
          description: "Abre Instagram y pega el enlace que ha sido copiado a tu portapapeles.",
        });
        navigator.clipboard.writeText(url);
        window.open('https://www.instagram.com/', '_blank');
        break;
        
      case 'twitter':
        // Compartir en X (Twitter)
        logInfo('Sharing campaign to Twitter/X', 'AdminPage', { campaignId: campaign.id });
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      
      default:
        // Comportamiento por defecto: copiar al portapapeles
        navigator.clipboard.writeText(url);
        
        logInfo('Campaign link copied to clipboard', 'AdminPage', {
          campaignId: campaign.id,
          url
        });
        
        toast({
          title: "Enlace copiado",
          description: "El enlace de la campaña ha sido copiado al portapapeles.",
        });
    }
  };

  const handleViewDetails = (campaign: Campaign) => {
    navigate(`/campana/${campaign.id}`);
  };

  // Usar los datos de la API si están disponibles, de lo contrario usar el contexto local
  const displayedCampaigns = apiCampaigns || campaigns;
  
  const filteredCampaigns = displayedCampaigns.filter(campaign => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return campaign.status === "active";
    if (activeTab === "completed") return campaign.status === "completed";
    if (activeTab === "other") return campaign.status !== "active" && campaign.status !== "completed";
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">Gestiona todas tus campañas de descuento grupal</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <div className="flex flex-col items-end">
            <Button 
              onClick={handleRefresh} 
              variant="outline"
              className="flex items-center"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> 
              {isLoading ? "Cargando..." : "Actualizar"}
            </Button>
            <div className="text-xs text-gray-500 mt-1">
              Próxima actualización en {nextRefreshIn}s
            </div>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Campaña
          </Button>
        </div>
      </div>
      
      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-600">Campañas Totales</p>
              <h3 className="text-2xl font-bold text-blue-800">{campaignStats.total}</h3>
            </div>
            <ShoppingBag className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-green-600">Campañas Activas</p>
              <h3 className="text-2xl font-bold text-green-800">{campaignStats.active}</h3>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>
        
        <Card className="bg-indigo-50">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600">Campañas Completadas</p>
              <h3 className="text-2xl font-bold text-indigo-800">{campaignStats.completed}</h3>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-purple-600">Otros Estados</p>
              <h3 className="text-2xl font-bold text-purple-800">{campaignStats.other}</h3>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>
      
      {/* Listado de campañas con tabs */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <CardTitle>Campañas</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3 sm:mt-0">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="completed">Completadas</TabsTrigger>
                <TabsTrigger value="other">Otras</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredCampaigns.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay campañas para mostrar en esta categoría.
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Crear nueva campaña
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-left">Estado</th>
                    <th className="px-4 py-3 text-center">Progreso</th>
                    <th className="px-4 py-3 text-center">Participantes</th>
                    <th className="px-4 py-3 text-center">Descuento</th>
                    <th className="px-4 py-3 text-center">Fecha creación</th>
                    <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => {
                    const progress = (campaign.currentParticipants / campaign.requiredParticipants) * 100;
                    const discountPercent = Math.round((1 - campaign.groupPrice / campaign.regularPrice) * 100);
                    
                    return (
                      <tr key={campaign.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                src={campaign.imageUrl || headphonesImage} 
                                alt={campaign.productName}
                                className="h-10 w-10 object-contain"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{campaign.productName}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">{campaign.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <CampaignStatusBadge status={campaign.status} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`rounded-full h-2.5 ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-600">{Math.round(progress)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-medium">{campaign.currentParticipants}</span>
                          <span className="text-gray-500">/{campaign.requiredParticipants}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge className="bg-green-100 text-green-800">
                            -{discountPercent}%
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-center text-xs text-gray-500">
                          {formatDistanceToNow(new Date(campaign.createdAt), { 
                            addSuffix: true,
                            locale: es 
                          })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewDetails(campaign)}
                              title="Ver detalles"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsEditDialogOpen(true);
                              }}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleStatus(campaign)}
                              title={campaign.status === 'active' ? 'Pausar' : 'Activar'}
                            >
                              {campaign.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDuplicateCampaign(campaign)}
                              title="Duplicar"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Compartir"
                                  >
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Compartir campaña</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleShareCampaign(campaign, "facebook")}
                                        className="flex items-center justify-center h-8 bg-[#3b5998] text-white hover:bg-[#324b81] transition-colors"
                                      >
                                        <Facebook className="h-4 w-4 mr-1.5" />
                                        Facebook
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleShareCampaign(campaign, "whatsapp")}
                                        className="flex items-center justify-center h-8 bg-[#25D366] text-white hover:bg-[#1fb855] transition-colors"
                                      >
                                        <FaWhatsapp className="h-4 w-4 mr-1.5" />
                                        WhatsApp
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleShareCampaign(campaign, "instagram")}
                                        className="flex items-center justify-center h-8 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 transition-opacity"
                                      >
                                        <Instagram className="h-4 w-4 mr-1.5" />
                                        Instagram
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() => handleShareCampaign(campaign, "twitter")}
                                        className="flex items-center justify-center h-8 bg-black text-white hover:bg-gray-800 transition-colors"
                                      >
                                        <FaXTwitter className="h-4 w-4 mr-1.5" />
                                        X
                                      </Button>
                                    </div>
                                    <div>
                                      <Button
                                        variant="default"
                                        onClick={() => handleShareCampaign(campaign)}
                                        className="w-full flex items-center gap-2"
                                      >
                                        <Share2 className="h-4 w-4" />
                                        Copiar enlace
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteCampaign(campaign)}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t border-gray-200 px-4 py-3 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredCampaigns.length} de {campaigns.length} campañas
          </p>
          
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Dialog para crear campaña */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear nueva campaña</DialogTitle>
          </DialogHeader>
          <CampaignForm 
            onSubmit={handleCreateCampaign} 
            onCancel={() => setIsCreateDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog para editar campaña */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar campaña</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <CampaignForm 
              initialData={selectedCampaign}
              onSubmit={handleEditCampaign} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedCampaign(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
