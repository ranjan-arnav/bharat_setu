import { create } from 'zustand';
import { getRoleFromKarma, type UserRole } from './permissions';
import type { CollectiveCluster } from './intelligence';

export type UserType = 'citizen' | 'government';

export type AgentKey = 'nagarik_mitra' | 'swasthya_sahayak' | 'yojana_saathi' | 'arthik_salahkar' | 'vidhi_sahayak' | 'kisan_mitra';
export type OverlayType = 'none' | 'agent-chat' | 'grievance' | 'scheme-scanner' | 'voice' | 'impact' | 'scam-alert' | 'sos-active' | 'digipin' | 'track' | 'emergency-contacts';
export type TrackedItemType = 'grievance' | 'scheme' | 'health' | 'legal' | 'finance';

export interface TrackedItem {
  id: string;
  type: TrackedItemType;
  title: string;
  description: string;
  status: 'Active' | 'Under Review' | 'In Progress' | 'Resolved' | 'Pending';
  createdAt: number;
  agentKey: AgentKey;
  refId?: string;           // e.g. GRV-NM-2026-XXXX or WTR-XXXX, generated with new Date().getFullYear()
  neighbourhood?: number;   // others in same DIGIPIN zone w/ same issue
  emoji?: string;
  portal?: string;          // deeplink portal name
  eta?: string;             // expected resolution
  amount?: string;          // financial amount involved
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: 1 | 2;
}

export interface CitizenProfile {
  name: string;
  nameHindi: string;
  aadhaarMasked: string;
  dob: string;
  gender: string;
  mobile: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  digipin: string;
  language: string;
  occupation: string;
  income: number;
  bplCard: boolean;
  rationCardType: string;
  linkedSchemes: string[];
  eligibleSchemes: string[];
  aadhaarVerified: boolean;
  emergencyContacts: EmergencyContact[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentKey?: AgentKey;
  imageUrl?: string;
  imageAlt?: string;
}

export interface ActiveForm {
  type: string;
  title: string;
  fields: { name: string; label: string; autofillSource?: string }[];
  documents?: string[];
}

interface Grievance {
  id: string;
  description: string;
  category: string;
  digipin: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';
  imageCaption?: string;
  submittedAt: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userType: UserType;
  role: UserRole;
  login: (name: string, userType: UserType) => void;
  logout: () => void;

  // Overlay management
  activeOverlay: OverlayType;
  setOverlay: (overlay: OverlayType) => void;

  // Agent chat
  activeAgent: AgentKey;
  setActiveAgent: (agent: AgentKey) => void;
  chatHistory: Record<AgentKey, ChatMessage[]>;
  addMessage: (agentKey: AgentKey, message: ChatMessage) => void;
  clearChat: (agentKey: AgentKey) => void;

  // Voice
  isListening: boolean;
  setListening: (val: boolean) => void;
  lastTranscript: string;
  setTranscript: (text: string) => void;

  // Onboarding
  onboardingComplete: boolean;
  completeOnboarding: () => void;

  // User profile (for scheme matching)
  userProfile: {
    name: string;
    digipin: string;
    language: string;
    state: string;
    occupation: string;
    income: number;
  };
  setUserProfile: (profile: Partial<AppState['userProfile']>) => void;

  // Rich citizen profile (post-onboarding)
  citizenProfile: CitizenProfile | null;
  setCitizenProfile: (profile: CitizenProfile) => void;

  // Grievances
  grievances: Grievance[];
  addGrievance: (g: Grievance) => void;

  // Emergency contacts
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;

  // Tracked items from chat (auto-added)
  trackedItems: TrackedItem[];
  addTrackedItem: (item: TrackedItem) => void;
  updateTrackedStatus: (id: string, status: TrackedItem['status']) => void;
  enrichTrackedItem: (id: string, patch: Partial<Pick<TrackedItem, 'title' | 'description' | 'status' | 'refId' | 'eta' | 'portal' | 'emoji' | 'neighbourhood' | 'amount'>>) => void;

  // Track tab badge count
  trackBadge: number;
  clearTrackBadge: () => void;

  // Notification count
  notifications: number;
  setNotifications: (n: number) => void;

  // Karma score & Gamification
  karmaScore: number;
  addKarma: (points: number) => void;
  redeemedRewards: string[];
  redeemReward: (cost: number, rewardId: string) => boolean;

  // Global Contextual Form State
  activeForm: ActiveForm | null;
  setActiveForm: (form: ActiveForm | null) => void;
  formData: Record<string, string>;
  setFormData: (data: Record<string, string>) => void;

  // Intelligence: Collective Action clusters
  collectiveClusters: CollectiveCluster[];
  addCluster: (cluster: CollectiveCluster) => void;
  joinCluster: (clusterId: string) => void;
}

export function getUserLevelDescriptor(karma: number) {
  if (karma >= 150) return { title: 'Community Head', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20', icon: 'stars' };
  if (karma >= 51) return { title: 'Contributor', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', icon: 'military_tech' };
  return { title: 'Citizen', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20', icon: 'person' };
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  userType: 'citizen',
  role: 'citizen',
  login: (name, userType) => set((state) => ({
    isAuthenticated: true,
    userType,
    role: getRoleFromKarma(state.karmaScore, userType),
    userProfile: { ...state.userProfile, name },
    onboardingComplete: userType === 'government' ? true : state.onboardingComplete,
  })),
  logout: () => set({ isAuthenticated: false, userType: 'citizen', role: 'citizen', onboardingComplete: false }),

  onboardingComplete: false,
  completeOnboarding: () => set({ onboardingComplete: true }),

  activeOverlay: 'none',
  setOverlay: (overlay) => set({ activeOverlay: overlay }),

  activeAgent: 'nagarik_mitra',
  setActiveAgent: (agent) => set({ activeAgent: agent }),
  chatHistory: {
    nagarik_mitra: [],
    swasthya_sahayak: [],
    yojana_saathi: [],
    arthik_salahkar: [],
    vidhi_sahayak: [],
    kisan_mitra: [],
  },
  addMessage: (agentKey, message) =>
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [agentKey]: [...state.chatHistory[agentKey], message],
      },
    })),
  clearChat: (agentKey) =>
    set((state) => ({
      chatHistory: {
        ...state.chatHistory,
        [agentKey]: [],
      },
    })),

  isListening: false,
  setListening: (val) => set({ isListening: val }),
  lastTranscript: '',
  setTranscript: (text) => set({ lastTranscript: text }),

  userProfile: {
    name: '',
    digipin: '',
    language: 'hi',
    state: '',
    occupation: '',
    income: 0,
  },
  setUserProfile: (profile) =>
    set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

  citizenProfile: null,
  setCitizenProfile: (profile) => set({ citizenProfile: profile }),

  grievances: [],
  addGrievance: (g) => set((state) => ({ grievances: [...state.grievances, g] })),

  addEmergencyContact: (contact) => set((state) => {
    const newContact: EmergencyContact = { ...contact, id: `ec-${Date.now()}` };
    const profile = state.citizenProfile;
    if (!profile) return {};
    return { citizenProfile: { ...profile, emergencyContacts: [...(profile.emergencyContacts || []), newContact] } };
  }),
  removeEmergencyContact: (id) => set((state) => {
    const profile = state.citizenProfile;
    if (!profile) return {};
    return { citizenProfile: { ...profile, emergencyContacts: (profile.emergencyContacts || []).filter(c => c.id !== id) } };
  }),

  trackedItems: [
    { id: 'demo-1', type: 'grievance', title: 'Broken streetlight — Ward 42', description: 'Street lamp near Baharpur post office not working for 3 days', status: 'In Progress', createdAt: Date.now() - 86400000 * 2, agentKey: 'nagarik_mitra', refId: `GRV-NM-${new Date().getFullYear()}-0847`, neighbourhood: 12, emoji: '🔦', portal: 'pgportal.gov.in', eta: '48 hours' },
    { id: 'demo-2', type: 'scheme', title: 'PM-KISAN Installment Pending', description: `${new Date().toLocaleString('default', { month: 'short' })} ${new Date().getFullYear()} installment of ₹2,000 not received`, status: 'Under Review', createdAt: Date.now() - 86400000, agentKey: 'yojana_saathi', refId: `KISAN-TKT-${new Date().getFullYear()}-8821`, emoji: '🌾', portal: 'pmkisan.gov.in', amount: '₹2,000' },
    { id: 'demo-3', type: 'health', title: 'Ayushman Bharat Card Applied', description: 'PMJAY card application submitted via ABHA', status: 'Pending', createdAt: Date.now() - 3600000 * 5, agentKey: 'swasthya_sahayak', refId: `PMJAY-${new Date().getFullYear()}-4421`, emoji: '💊', portal: 'pmjay.gov.in' },
  ],
  addTrackedItem: (item) => set((state) => ({
    trackedItems: [item, ...state.trackedItems],
    trackBadge: state.trackBadge + 1,
    karmaScore: state.karmaScore + 50, // award 50 karma for each tracked item
  })),
  updateTrackedStatus: (id, status) => set((state) => ({ trackedItems: state.trackedItems.map(t => t.id === id ? { ...t, status } : t) })),
  enrichTrackedItem: (id, patch) => set((state) => ({ trackedItems: state.trackedItems.map(t => t.id === id ? { ...t, ...patch } : t) })),

  trackBadge: 3, // matches 3 seeded demo trackedItems
  clearTrackBadge: () => set({ trackBadge: 0 }),

  notifications: 3, // Initial mock count
  setNotifications: (n) => set({ notifications: n }),

  karmaScore: 1250,
  addKarma: (points) => set((state) => {
    const newKarma = state.karmaScore + points;
    return { karmaScore: newKarma, role: getRoleFromKarma(newKarma, state.userType) };
  }),
  
  redeemedRewards: [],
  redeemReward: (cost, rewardId) => {
    let success = false;
    set((state) => {
      if (state.karmaScore >= cost && !state.redeemedRewards.includes(rewardId)) {
        success = true;
        return { 
          karmaScore: state.karmaScore - cost, 
          redeemedRewards: [...state.redeemedRewards, rewardId] 
        };
      }
      return state;
    });
    return success;
  },

  activeForm: null,
  setActiveForm: (form) => set({ activeForm: form }),
  formData: {},
  setFormData: (data) => set({ formData: data }),

  collectiveClusters: [],
  addCluster: (cluster) => set((state) => ({ collectiveClusters: [cluster, ...state.collectiveClusters] })),
  joinCluster: (clusterId) => set((state) => ({
    collectiveClusters: state.collectiveClusters.map(c => c.clusterId === clusterId ? { ...c, participantCount: c.participantCount + 1 } : c),
    karmaScore: state.karmaScore + 5, // karma for collective action
  })),
}));
