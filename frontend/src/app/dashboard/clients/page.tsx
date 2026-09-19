"use client";
import { Users } from "lucide-react";
import { useAppointments } from "@/hooks/useApi";
import { Avatar, Skeleton, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function ClientsPage() {
  const { data, isLoading } = useAppointments();
  const appointments = data?.results ?? [];
  const clientMap = new Map<string, { name: string; email?: string; lastVisit: string; count: number }>();
  appointments.forEach((a) => {
    const existing = clientMap.get(a.client);
    if (existing) { existing.count++; if (a.date > existing.lastVisit) existing.lastVisit = a.date; }
    else clientMap.set(a.client, { name: a.client_name, email: a.client_email, lastVisit: a.date, count: 1 });
  });
  const clients = Array.from(clientMap.entries()).sort((a, b) => b[1].lastVisit.localeCompare(a[1].lastVisit));

  if (isLoading) return <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
  if (clients.length === 0) return <EmptyState icon={<Users size={48} />} title="No clients yet" description="Clients will appear here after their first booking." />;

  return (
    <div className="space-y-3">
      {clients.map(([id, c]) => (
        <div key={id} className="card flex items-center gap-4">
          <Avatar name={c.name} />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{c.name}</p>
            {c.email && <p className="text-xs text-ink-400 truncate">{c.email}</p>}
          </div>
          <div className="text-right text-sm shrink-0">
            <p className="font-medium">{c.count} {c.count === 1 ? "session" : "sessions"}</p>
            <p className="text-xs text-ink-400">Last: {formatDate(c.lastVisit)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
