import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Campaign, CampaignContextType, CampaignFormInput, Participant } from "@/types";
import { saveCampaign, getCampaign, getAllCampaigns as getStoredCampaigns, deleteCampaign } from "@/utils/localStorage";
import headphonesImage from "../assets/headphones.png";
import { logInfo, logWarning, logError, logDebug } from "@/utils/logger";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const queryClient = useQueryClient();

  // Consulta de React Query para obtener todas las campañas
  const { data: campaignsData, isLoading, error } = useQuery({ 
    queryKey: ['/api/campaigns'],
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  useEffect(() => {
    if (campaignsData) {
      // Si tenemos datos de la API, los usamos
      setCampaigns(campaignsData);
      logInfo(`Loaded ${campaignsData.length} campaigns from API`, 'CampaignContext');
    } else {
      // Fallback a localStorage si la API no responde
      const storedCampaigns = getStoredCampaigns();
      setCampaigns(storedCampaigns);
      logInfo(`Loaded ${storedCampaigns.length} campaigns from storage`, 'CampaignContext');
    }
  }, [campaignsData]);

  // Mutación para crear campaña
  const createCampaignMutation = useMutation({
    mutationFn: (campaignData: CampaignFormInput) => 
      apiRequest("POST", "/api/campaigns", campaignData)
        .then(res => res.json()),
    onSuccess: (newCampaign: Campaign) => {
      // Invalidar la consulta para que se actualicen los datos
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      setActiveCampaign(newCampaign);
      logInfo(`Campaign created successfully: ${newCampaign.id}`, 'CampaignContext');
    },
    onError: (error) => {
      logError(`Failed to create campaign: ${error}`, 'CampaignContext');
    }
  });

  // Método para crear una campaña con parámetros personalizados
  const createCampaignWithParams = (campaignData: CampaignFormInput): Campaign => {
    // Calcula la fecha de expiración (48 horas por defecto si no se proporciona)
    const expiresAtDate = campaignData.expiresAt 
      ? new Date(campaignData.expiresAt) 
      : new Date(Date.now() + 48 * 60 * 60 * 1000);
    
    logInfo(`Creating new campaign: ${campaignData.productName}`, 'CampaignContext', { 
      price: campaignData.groupPrice,
      requiredParticipants: campaignData.requiredParticipants
    });
    
    // Agregar campos adicionales para la API
    const fullCampaignData = {
      ...campaignData,
      expiresAt: expiresAtDate.toISOString(),
      imageUrl: headphonesImage,
    };
    
    try {
      // Intentar guardar a través de la API
      createCampaignMutation.mutate(fullCampaignData);
      
      // Crear un objeto temporal para la interfaz mientras se guarda en la API
      const tempCampaign: Campaign = {
        id: 'temp_' + Math.random().toString(36).substring(2, 9),
        productName: campaignData.productName,
        description: campaignData.description,
        regularPrice: campaignData.regularPrice,
        groupPrice: campaignData.groupPrice,
        requiredParticipants: campaignData.requiredParticipants,
        currentParticipants: 1,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAtDate.toISOString(),
        status: 'active',
        category: campaignData.category,
        imageUrl: headphonesImage,
        participants: [
          {
            id: 'usr_' + Math.random().toString(36).substring(2, 9),
            name: 'Administrador',
            joinedAt: new Date().toISOString()
          }
        ]
      };
      
      // También guardamos en localStorage como respaldo
      saveCampaign(tempCampaign);
      
      return tempCampaign;
    } catch (error) {
      logError(`Failed to create campaign: ${error}`, 'CampaignContext');
      throw error;
    }
  };

  // Mantener el método original para retrocompatibilidad
  const createCampaign = (): Campaign => {
    return createCampaignWithParams({
      productName: 'Audífonos Inalámbricos Premium',
      description: 'Audífonos inalámbricos con cancelación de ruido, batería de larga duración y sonido de alta fidelidad.',
      regularPrice: 30,
      groupPrice: 20,
      requiredParticipants: 10
    });
  };

  // Método para actualizar una campaña existente
  const updateCampaign = (campaignId: string, updateData: Partial<Campaign>): Campaign | null => {
    const campaign = getCampaign(campaignId);
    if (!campaign) {
      logWarning(`Campaign not found for update: ${campaignId}`, 'CampaignContext');
      return null;
    }

    logInfo(`Updating campaign: ${campaignId}`, 'CampaignContext', updateData);

    // Actualizar los campos proporcionados
    const updatedCampaign: Campaign = { ...campaign, ...updateData };
    
    try {
      // Save to localStorage
      saveCampaign(updatedCampaign);
      
      // Update state
      setCampaigns(prev => prev.map(c => c.id === campaignId ? updatedCampaign : c));
      if (activeCampaign?.id === campaignId) {
        setActiveCampaign(updatedCampaign);
      }
      
      logInfo(`Campaign updated successfully: ${updatedCampaign.id}`, 'CampaignContext');
      return updatedCampaign;
    } catch (error) {
      logError(`Failed to update campaign: ${error}`, 'CampaignContext');
      return null;
    }
  };

  // Método para duplicar una campaña
  const duplicateCampaign = (campaignId: string): Campaign | null => {
    const campaign = getCampaign(campaignId);
    if (!campaign) {
      logWarning(`Campaign not found for duplication: ${campaignId}`, 'CampaignContext');
      return null;
    }

    logInfo(`Duplicating campaign: ${campaignId}`, 'CampaignContext', { productName: campaign.productName });

    // Crear una nueva campaña basada en la existente
    const newCampaignId = 'cmp_' + Math.random().toString(36).substring(2, 9);
    const currentDate = new Date();
    
    // Calcula una nueva fecha de expiración basada en la actual
    const newExpiresAt = campaign.expiresAt 
      ? new Date(new Date(campaign.expiresAt).getTime() + 48 * 60 * 60 * 1000).toISOString()
      : new Date(currentDate.getTime() + 48 * 60 * 60 * 1000).toISOString();
    
    const duplicatedCampaign: Campaign = {
      ...campaign,
      id: newCampaignId,
      productName: `${campaign.productName} (copia)`,
      currentParticipants: 1,
      createdAt: currentDate.toISOString(),
      expiresAt: newExpiresAt,
      status: 'active',
      participants: [
        {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          name: 'Administrador',
          joinedAt: currentDate.toISOString()
        }
      ]
    };
    
    try {
      // Save to localStorage
      saveCampaign(duplicatedCampaign);
      
      // Update state
      setCampaigns(prev => [...prev, duplicatedCampaign]);
      
      logInfo(`Campaign duplicated successfully: ${duplicatedCampaign.id}`, 'CampaignContext', {
        originalId: campaignId,
        newId: duplicatedCampaign.id
      });
      return duplicatedCampaign;
    } catch (error) {
      logError(`Failed to duplicate campaign: ${error}`, 'CampaignContext');
      return null;
    }
  };

  // Método para cambiar el estado de una campaña
  const changeCampaignStatus = (campaignId: string, newStatus: 'active' | 'paused' | 'completed' | 'expired'): Campaign | null => {
    return updateCampaign(campaignId, { status: newStatus });
  };

  // Método para eliminar una campaña
  const removeCampaign = (campaignId: string): boolean => {
    logInfo(`Attempting to remove campaign: ${campaignId}`, 'CampaignContext');
    try {
      deleteCampaign(campaignId);
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      if (activeCampaign?.id === campaignId) {
        setActiveCampaign(null);
      }
      logInfo(`Campaign removed successfully: ${campaignId}`, 'CampaignContext');
      return true;
    } catch (error) {
      logError(`Failed to remove campaign: ${error}`, 'CampaignContext', { campaignId });
      return false;
    }
  };

  // Consulta para cargar una campaña específica por ID
  const loadCampaignQuery = (id: string) => {
    return useQuery({
      queryKey: [`/api/campaigns/${id}`],
      enabled: !!id, // Solo ejecutar si hay un ID
      staleTime: 1000 * 60, // 1 minuto
      onSuccess: (campaign) => {
        setActiveCampaign(campaign);
        logInfo(`Campaign loaded successfully from API: ${id}`, 'CampaignContext');
      },
      onError: (error) => {
        logError(`Failed to load campaign from API: ${error}`, 'CampaignContext');
      }
    });
  };

  const loadCampaign = (id: string): Campaign | null => {
    logInfo(`Loading campaign: ${id}`, 'CampaignContext');
    
    // Intentar cargar desde la API primero
    apiRequest("GET", `/api/campaigns/${id}`)
      .then(res => res.json())
      .then(campaign => {
        if (campaign) {
          setActiveCampaign(campaign);
          // Actualizamos la caché de React Query
          queryClient.setQueryData([`/api/campaigns/${id}`], campaign);
          logInfo(`Campaign loaded successfully from API: ${id}`, 'CampaignContext');
        }
      })
      .catch(error => {
        logWarning(`Failed to load campaign from API: ${error}`, 'CampaignContext');
        
        // Fallback a localStorage si falla la API
        const localCampaign = getCampaign(id);
        if (localCampaign) {
          setActiveCampaign(localCampaign);
          logInfo(`Campaign loaded from localStorage: ${id}`, 'CampaignContext');
          return localCampaign;
        }
      });
    
    // Devolvemos el que tengamos en caché mientras la API responde
    const cachedCampaign = campaigns.find(c => c.id === id) || null;
    if (cachedCampaign) {
      setActiveCampaign(cachedCampaign);
      return cachedCampaign;
    }
    
    // Si no lo encontramos, intentamos en localStorage
    const localCampaign = getCampaign(id);
    if (localCampaign) {
      setActiveCampaign(localCampaign);
      return localCampaign;
    }
    
    logWarning(`Campaign not found: ${id}`, 'CampaignContext');
    return null;
  };

  // Mutación para añadir participante
  const addParticipantMutation = useMutation({
    mutationFn: ({ 
      campaignId, 
      name 
    }: { 
      campaignId: string; 
      name: string 
    }) => 
      apiRequest("POST", `/api/campaigns/${campaignId}/participants`, { name })
        .then(res => res.json()),
    onSuccess: (participant: Participant, variables) => {
      // Invalidar las consultas relevantes
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${variables.campaignId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/campaigns/${variables.campaignId}/participants`] });
      
      logInfo(`Participant added successfully via API: ${participant.id}`, 'CampaignContext');
    },
    onError: (error, variables) => {
      logError(`Failed to add participant via API: ${error}`, 'CampaignContext', { 
        campaignId: variables.campaignId 
      });
    }
  });

  const joinCampaign = (campaignId: string) => {
    logInfo(`Adding participant to campaign: ${campaignId}`, 'CampaignContext');
    
    // Nombre para el nuevo participante
    const participantName = `Participante ${Date.now().toString().slice(-4)}`;
    
    // Intentar agregar a través de la API
    addParticipantMutation.mutate({ 
      campaignId, 
      name: participantName 
    });
    
    // También actualizamos el almacenamiento local como respaldo
    const campaign = getCampaign(campaignId);
    if (campaign) {
      // Add a new participant locally
      campaign.currentParticipants += 1;
      const participantId = 'usr_' + Math.random().toString(36).substring(2, 9);
      campaign.participants.push({
        id: participantId,
        name: participantName,
        joinedAt: new Date().toISOString()
      });

      // Verificar si la campaña ha alcanzado su objetivo
      const isCampaignComplete = campaign.currentParticipants >= campaign.requiredParticipants;
      if (isCampaignComplete) {
        campaign.status = 'completed';
        logInfo(`Campaign goal reached locally: ${campaignId}`, 'CampaignContext', {
          participants: campaign.currentParticipants,
          required: campaign.requiredParticipants
        });
      }

      try {
        // Save updated campaign to localStorage
        saveCampaign(campaign);
        
        // Update local state
        setActiveCampaign(campaign);
        setCampaigns(prev => prev.map(c => c.id === campaignId ? campaign : c));
        
        logInfo(`Participant ${participantId} added locally to campaign: ${campaignId}`, 'CampaignContext');
      } catch (error) {
        logError(`Failed to update local campaign: ${error}`, 'CampaignContext', { campaignId });
      }
    }
  };

  const getAllCampaigns = (): Campaign[] => {
    logInfo('Fetching all campaigns', 'CampaignContext');
    
    // Intentar obtener de la API y actualizar el estado
    apiRequest("GET", "/api/campaigns")
      .then(res => res.json())
      .then((apiCampaigns: Campaign[]) => {
        if (apiCampaigns && Array.isArray(apiCampaigns)) {
          setCampaigns(apiCampaigns);
          queryClient.setQueryData(['/api/campaigns'], apiCampaigns);
          logInfo(`Retrieved ${apiCampaigns.length} campaigns from API`, 'CampaignContext');
          
          // También actualizamos el almacenamiento local para respaldo
          apiCampaigns.forEach(campaign => saveCampaign(campaign));
        }
      })
      .catch(error => {
        logWarning(`Failed to fetch campaigns from API: ${error}`, 'CampaignContext');
      });
    
    // Devolvemos lo que tenemos en caché mientras la API responde
    if (campaigns.length > 0) {
      return campaigns;
    }
    
    // Si no tenemos nada en caché, usamos localStorage
    const storedCampaigns = getStoredCampaigns();
    logInfo(`Retrieved ${storedCampaigns.length} campaigns from localStorage`, 'CampaignContext');
    return storedCampaigns;
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        activeCampaign,
        loadCampaign,
        createCampaign,
        createCampaignWithParams,
        updateCampaign,
        duplicateCampaign,
        changeCampaignStatus,
        removeCampaign,
        joinCampaign,
        setActiveCampaign,
        getAllCampaigns
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
};
