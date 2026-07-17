import { getStore, saveStore } from "@/lib/store";

export async function POST() {
  try {
    const store = await getStore();
    store.stats.views += 1;
    await saveStore(store);
  } catch {}
  return Response.json({ ok: true });
}
