import { getStore, saveStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { id } = (await req.json()) as { id?: string };
    if (id) {
      const store = await getStore();
      const link = store.links.find((l) => l.id === id);
      if (link) {
        link.clicks += 1;
        await saveStore(store);
      }
    }
  } catch {}
  return Response.json({ ok: true });
}
