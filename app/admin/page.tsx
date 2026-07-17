import { getStore } from "@/lib/store";
import Dashboard from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await getStore();
  return <Dashboard store={store} />;
}
