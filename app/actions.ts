"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStore, saveStore, newId } from "@/lib/store";
import type { IconKey } from "@/lib/types";
import { checkPassword, setSession, clearSession, isAdmin } from "@/lib/auth";

async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/login");
}

async function refresh(): Promise<void> {
  revalidatePath("/");
  revalidatePath("/admin");
}

function cleanUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) redirect("/login?error=1");
  await setSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/login");
}

export async function saveProfile(formData: FormData): Promise<void> {
  await requireAdmin();
  const store = await getStore();
  store.profile = {
    name: String(formData.get("name") ?? "").trim() || store.profile.name,
    handle: String(formData.get("handle") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    avatarUrl: String(formData.get("avatarUrl") ?? "").trim(),
  };
  await saveStore(store);
  await refresh();
}

export async function saveSocials(formData: FormData): Promise<void> {
  await requireAdmin();
  const store = await getStore();
  store.socials = {
    whatsapp: cleanUrl(String(formData.get("whatsapp") ?? "")),
    tiktok: cleanUrl(String(formData.get("tiktok") ?? "")),
    facebook: cleanUrl(String(formData.get("facebook") ?? "")),
    instagram: cleanUrl(String(formData.get("instagram") ?? "")),
    maps: cleanUrl(String(formData.get("maps") ?? "")),
  };
  await saveStore(store);
  await refresh();
}

export async function upsertLink(formData: FormData): Promise<void> {
  await requireAdmin();
  const store = await getStore();

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = cleanUrl(String(formData.get("url") ?? ""));
  if (!title || !url) return;

  const numbers = String(formData.get("numbers") ?? "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const patch = {
    title,
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    url,
    icon: String(formData.get("icon") ?? "link") as IconKey,
    featured: formData.get("featured") === "on",
    numbers: numbers.length ? numbers : undefined,
  };

  if (id) {
    const link = store.links.find((l) => l.id === id);
    if (link) Object.assign(link, patch);
  } else {
    store.links.push({ id: newId(), ...patch, enabled: true, clicks: 0 });
  }

  await saveStore(store);
  await refresh();
}

export async function deleteLink(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const store = await getStore();
  store.links = store.links.filter((l) => l.id !== id);
  await saveStore(store);
  await refresh();
}

export async function toggleLink(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const store = await getStore();
  const link = store.links.find((l) => l.id === id);
  if (link) {
    link.enabled = !link.enabled;
    await saveStore(store);
  }
  await refresh();
}

export async function setTiktokStyle(formData: FormData): Promise<void> {
  await requireAdmin();
  const style = String(formData.get("style") ?? "");
  if (style !== "separate" && style !== "dropdown") return;
  const store = await getStore();
  store.settings = { ...store.settings, tiktokStyle: style };
  await saveStore(store);
  await refresh();
}

export async function moveLink(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("dir") ?? "");
  const store = await getStore();
  const i = store.links.findIndex((l) => l.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= store.links.length) return;
  [store.links[i], store.links[j]] = [store.links[j], store.links[i]];
  await saveStore(store);
  await refresh();
}
