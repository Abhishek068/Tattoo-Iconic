"use client";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { useAppointments, useCancelAppointment } from "@/hooks/useApi";
import { StatusBadge, EmptyState, Skeleton } from "@/components/ui";
import { cn, formatDate, formatTime, capitalize } from "@/lib/utils";
import { STATUS_CONFIG } from "@/constants";
import toast from "react-hot-toast";

const TABS = ["all", "pending", "confirmed", "in_progress", "completed", "cancelled"] as const;

export default function AppointmentsPage() {
  const [tab, setTab] = useState("all");
  const params: Record<string, string> = {};
  if (tab !== "all") params.status = tab;
  const { data, isLoading, refetch } = useAppointments(params);
  const cancel = useCancelAppointment();
  const items = data?.results ?? [];

  async function handleCancel(id: string) {
    if (!confirm("Cancel this appointment?")) return;
    try { await cancel.mutateAsync(id); toast.success("Cancelled"); refetch(); } catch { toast.error("Failed to cancel"); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
        <Link href="/booking" className="btn-primary text-sm"><Plus size={16} className="mr-1" /> New Booking</Link>
      </div>
      <div className="flex gap-1 border-b border-ink-100 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("shrink-0 border-b-2 px-4 py-2.5 text-sm transition-colors whitespace-nowrap", tab === t ? "border-brand font-medium text-brand" : "border-transparent text-ink-500 hover:text-ink-700")}>{capitalize(t)}</button>
        ))}
      </div>
      {isLoading ? (
        <div className="mt-6 space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState icon={<Calendar size={48} />} title="No appointments" description={tab === "all" ? "You don't have any appointments yet." : `No ${tab} appointments.`}
          action={<Link href="/booking" className="btn-primary text-sm">Book now</Link>} />
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((a) => (
            <div key={a.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{a.client_name || a.artist_name}</p>
                  <StatusBadge status={a.status} config={STATUS_CONFIG} />
                  {a.deposit_paid && <span className="badge bg-green-100 text-green-700">Deposit paid</span>}
                </div>
                <p className="mt-1 text-sm text-ink-500">{formatDate(a.date)} · {formatTime(a.start_time)} – {formatTime(a.end_time)} · {a.duration}min</p>
                <p className="text-sm text-ink-400">{a.style} · {a.placement} · {capitalize(a.size)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/dashboard/appointments/${a.id}`} className="btn-ghost text-xs">Details</Link>
                {["pending", "confirmed"].includes(a.status) && (
                  <button onClick={() => handleCancel(a.id)} className="btn-danger text-xs">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
