"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Clock, MapPin } from "lucide-react";
import { useAppointment, useUpdateAppointment, useCancelAppointment } from "@/hooks/useApi";
import { Spinner, StatusBadge } from "@/components/ui";
import { formatDate, formatTime, formatPrice, capitalize } from "@/lib/utils";
import { STATUS_CONFIG } from "@/constants";
import toast from "react-hot-toast";

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: appt, isLoading, refetch } = useAppointment(id);
  const update = useUpdateAppointment();
  const cancel = useCancelAppointment();

  if (isLoading) return <Spinner />;
  if (!appt) return <div className="text-center py-12"><h2 className="text-xl">Appointment not found</h2></div>;

  async function handleStatus(status: string) {
    try { await update.mutateAsync({ id, data: { status } }); toast.success(`Status updated to ${status}`); refetch(); } catch { toast.error("Update failed"); }
  }

  async function handleCancel() {
    if (!confirm("Cancel this appointment?")) return;
    try { await cancel.mutateAsync(id); toast.success("Cancelled"); router.push("/dashboard/appointments"); } catch { toast.error("Failed"); }
  }

  const rows = [
    ["Client", appt.client_name], ["Email", appt.client_email], ["Artist", appt.artist_name],
    ["Date", formatDate(appt.date)], ["Time", `${formatTime(appt.start_time)} – ${formatTime(appt.end_time)}`],
    ["Duration", `${appt.duration} minutes`], ["Style", appt.style], ["Placement", appt.placement],
    ["Size", capitalize(appt.size)], ["Deposit", `${formatPrice(appt.deposit_amount)} ${appt.deposit_paid ? "(Paid)" : "(Unpaid)"}`],
    ...(appt.total_price ? [["Total Price", formatPrice(appt.total_price)]] : []),
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/appointments" className="btn-ghost text-sm mb-6 inline-flex items-center gap-1"><ArrowLeft size={16} /> Back</Link>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3"><h1 className="text-2xl font-display">Appointment</h1><StatusBadge status={appt.status} config={STATUS_CONFIG} /></div>
      </div>
      <div className="card divide-y divide-ink-50">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between py-3 text-sm"><span className="text-ink-500">{label}</span><span className="font-medium text-ink-900 text-right">{value}</span></div>
        ))}
      </div>
      {appt.description && <div className="card mt-4"><h3 className="text-sm font-medium mb-2">Client Notes</h3><p className="text-sm text-ink-600">{appt.description}</p></div>}
      {appt.artist_notes && <div className="card mt-4"><h3 className="text-sm font-medium mb-2">Artist Notes</h3><p className="text-sm text-ink-600">{appt.artist_notes}</p></div>}
      <div className="mt-6 flex flex-wrap gap-2">
        {appt.status === "pending" && <button onClick={() => handleStatus("confirmed")} className="btn-primary text-sm">Confirm</button>}
        {appt.status === "confirmed" && <button onClick={() => handleStatus("in_progress")} className="btn-primary text-sm">Start Session</button>}
        {appt.status === "in_progress" && <button onClick={() => handleStatus("completed")} className="btn-primary text-sm">Complete</button>}
        {["pending", "confirmed"].includes(appt.status) && <button onClick={handleCancel} className="btn-danger text-sm">Cancel</button>}
      </div>
    </div>
  );
}
