export interface Participant {
  id: string;
  name: string;
  joinedAt: string;
}

export interface Campaign {
  id: string;
  productName: string;
  regularPrice: number;
  groupPrice: number;
  requiredParticipants: number;
  currentParticipants: number;
  createdAt: string;
  expiresAt?: string;
  status?: 'active' | 'paused' | 'completed' | 'expired';
  description?: string;
  imageUrl?: string;
  category?: string;
  participants: Participant[];
}

export interface AlternativeProduct {
  id: number;
  name: string;
  regularPrice: number;
  groupPrice: number;
  image: string;
}

export interface CampaignFormInput {
  productName: string;
  description?: string;
  regularPrice: number;
  groupPrice: number;
  requiredParticipants: number;
  expiresAt?: string;
  category?: string;
}

export interface CampaignContextType {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  loadCampaign: (id: string) => Campaign | null;
  createCampaign: () => Campaign;
  createCampaignWithParams: (campaignData: CampaignFormInput) => Campaign;
  updateCampaign: (campaignId: string, updateData: Partial<Campaign>) => Campaign | null;
  duplicateCampaign: (campaignId: string) => Campaign | null;
  changeCampaignStatus: (campaignId: string, newStatus: 'active' | 'paused' | 'completed' | 'expired') => Campaign | null;
  removeCampaign: (campaignId: string) => boolean;
  joinCampaign: (campaignId: string) => void;
  setActiveCampaign: (campaign: Campaign | null) => void;
  getAllCampaigns: () => Campaign[];
}

export interface ToastState {
  isVisible: boolean;
  message: string;
}

export interface TrackingInfo {
  trackingId: string;
  campaignId: string;
  productName: string;
  price: number;
  contactInfo: string;
  paymentStatus: "Pendiente" | "Confirmado" | "Reembolsado";
  timestamp: number;
}
