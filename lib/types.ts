export type IconKey =
  | "whatsapp"
  | "tiktok"
  | "facebook"
  | "instagram"
  | "maps"
  | "phone"
  | "link";

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: IconKey;
  enabled: boolean;
  featured?: boolean;
  clicks: number;
  /** Optional WhatsApp numbers — when present the card expands into a numbers list */
  numbers?: string[];
}

export interface Profile {
  name: string;
  handle: string;
  tagline: string;
  location: string;
  avatarUrl: string;
}

export interface Socials {
  whatsapp: string;
  tiktok: string;
  facebook: string;
  instagram: string;
  maps: string;
}

export interface Settings {
  /** How multiple TikTok links render on the public page */
  tiktokStyle: "separate" | "dropdown";
  /** Personal number of the store owner, shown in the gold block at the bottom */
  ownerName: string;
  ownerPhone: string;
}

export interface StoreData {
  profile: Profile;
  socials: Socials;
  links: LinkItem[];
  stats: { views: number };
  settings: Settings;
  updatedAt: string;
}
