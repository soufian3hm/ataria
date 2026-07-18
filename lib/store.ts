import { promises as fs } from "fs";
import path from "path";
import type { StoreData } from "./types";

const FILE = path.join(process.cwd(), "data", "store.json");

const SB_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SB_KEY = process.env.SUPABASE_SECRET_KEY;
const useSupabase = Boolean(SB_URL && SB_KEY);

function sbHeaders(): Record<string, string> {
  return { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY!}` };
}

const seed: StoreData = {
  profile: {
    name: "عطارية فدك",
    handle: "Fadk1",
    tagline: "أجود أنواع الأعشاب والعطارة الطبيعية",
    location: "كركوك، العراق",
    avatarUrl: "",
  },
  socials: {
    whatsapp: "https://wa.me/9647711911901",
    tiktok: "https://www.tiktok.com/@fadk94",
    facebook: "https://www.facebook.com/share/1BkyZZCW21/",
    instagram: "https://www.instagram.com/faadak94",
    maps: "https://goo.gl/maps/x3KhwjWnqVLY4ZS77",
  },
  links: [
    {
      id: "wa-main",
      title: "واتساب — تواصل معنا",
      subtitle: "اضغط لعرض جميع الأرقام",
      url: "https://wa.me/9647711911901",
      icon: "whatsapp",
      enabled: true,
      featured: true,
      clicks: 0,
      numbers: [
        "07711911901",
        "07751011911",
        "07751511911",
        "07751611911",
        "07751711911",
      ],
    },
    {
      id: "tt-main",
      title: "تيك توك — الحساب الرئيسي",
      subtitle: "@fadk94",
      url: "https://www.tiktok.com/@fadk94",
      icon: "tiktok",
      enabled: true,
      clicks: 0,
    },
    {
      id: "tt-2",
      title: "تيك توك — الحساب الثاني",
      subtitle: "@fadak51711911",
      url: "https://www.tiktok.com/@fadak51711911",
      icon: "tiktok",
      enabled: true,
      clicks: 0,
    },
    {
      id: "tt-3",
      title: "تيك توك — الحساب الثالث",
      subtitle: "@fadak77777",
      url: "https://www.tiktok.com/@fadak77777",
      icon: "tiktok",
      enabled: true,
      clicks: 0,
    },
    {
      id: "fb-main",
      title: "فيسبوك",
      subtitle: "صفحتنا الرسمية",
      url: "https://www.facebook.com/share/1BkyZZCW21/",
      icon: "facebook",
      enabled: true,
      clicks: 0,
    },
    {
      id: "ig-main",
      title: "انستغرام",
      subtitle: "@faadak94",
      url: "https://www.instagram.com/faadak94",
      icon: "instagram",
      enabled: true,
      clicks: 0,
    },
    {
      id: "map-main",
      title: "موقعنا على الخريطة",
      subtitle: "زورونا في كركوك",
      url: "https://goo.gl/maps/x3KhwjWnqVLY4ZS77",
      icon: "maps",
      enabled: true,
      clicks: 0,
    },
  ],
  stats: { views: 0 },
  settings: {
    tiktokStyle: "separate",
    ownerName: "محمد عطار",
    ownerPhone: "07725756958",
  },
  updatedAt: "",
};

/** Older stored blobs may miss newer fields — patch them in. */
function normalize(data: StoreData): StoreData {
  if (!data.settings) {
    data.settings = { tiktokStyle: "separate", ownerName: "", ownerPhone: "" };
  }
  if (data.settings.ownerName === undefined) data.settings.ownerName = "";
  if (data.settings.ownerPhone === undefined) data.settings.ownerPhone = "";
  return data;
}

async function readFileStore(): Promise<StoreData | null> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as StoreData;
  } catch {
    return null;
  }
}

async function writeFileStore(data: StoreData): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // read-only filesystem (e.g. serverless) — nothing we can do
  }
}

export async function getStore(): Promise<StoreData> {
  if (useSupabase) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/linkhub?id=eq.main&select=data`, {
        headers: sbHeaders(),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`read ${res.status}: ${await res.text()}`);
      const rows = (await res.json()) as { data: StoreData }[];
      if (rows[0]?.data) return normalize(rows[0].data);
      // Table exists but no row yet — seed it.
      const initial = normalize((await readFileStore()) ?? structuredClone(seed));
      await saveStore(initial);
      return initial;
    } catch (err) {
      console.warn("[store] Supabase unavailable, using file fallback:", err);
    }
  }
  const fromFile = await readFileStore();
  if (fromFile) return normalize(fromFile);
  const fresh = normalize(structuredClone(seed));
  await writeFileStore(fresh);
  return fresh;
}

export async function saveStore(data: StoreData): Promise<void> {
  data.updatedAt = new Date().toISOString();
  if (useSupabase) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/linkhub`, {
        method: "POST",
        headers: {
          ...sbHeaders(),
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({ id: "main", data, updated_at: data.updatedAt }),
      });
      if (!res.ok) throw new Error(`write ${res.status}: ${await res.text()}`);
      return;
    } catch (err) {
      console.warn("[store] Supabase write failed, using file fallback:", err);
    }
  }
  await writeFileStore(data);
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
