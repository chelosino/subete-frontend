import { Campaign } from "@/types";

const CAMPAIGN_PREFIX = 'campaign_';

export const saveCampaign = (campaign: Campaign): void => {
  localStorage.setItem(CAMPAIGN_PREFIX + campaign.id, JSON.stringify(campaign));
};

export const getCampaign = (id: string): Campaign | null => {
  const data = localStorage.getItem(CAMPAIGN_PREFIX + id);
  if (!data) return null;
  
  try {
    return JSON.parse(data) as Campaign;
  } catch (error) {
    console.error('Error parsing campaign data:', error);
    return null;
  }
};

export const getAllCampaigns = (): Campaign[] => {
  const campaigns: Campaign[] = [];
  
  // Iterate through all localStorage items
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CAMPAIGN_PREFIX)) {
      const campaignId = key.replace(CAMPAIGN_PREFIX, '');
      const campaign = getCampaign(campaignId);
      if (campaign) {
        campaigns.push(campaign);
      }
    }
  }
  
  // Sort by date (newest first)
  return campaigns.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const deleteCampaign = (id: string): void => {
  localStorage.removeItem(CAMPAIGN_PREFIX + id);
};
