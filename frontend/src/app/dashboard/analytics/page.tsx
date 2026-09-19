"use client";
import { Calendar, DollarSign, Users, Image as ImageIcon, TrendingUp, Star } from "lucide-react";
import { useAppointments, usePortfolio, useReviews } from "@/hooks/useApi";

export default function AnalyticsPage() {
  const { data: appts } = useAppointments();
  const { data: portfolio } = usePortfolio();
  const { data: reviews } = useReviews();
  const total = appts?.count ?? 0;
  const completed = appts?.results?.filter((a) => a.status === "completed").length ?? 0;
  const pending = appts?.results?.filter((a) => a.status === "pending").length ?? 0;
  const portfolioCount = portfolio?.count ?? 0;
  const avgRating = reviews?.results?.length ? (reviews.results.reduce((a, r) => a + r.rating, 0) / reviews.results.length).toFixed(1) : "—";
  const revenue = appts?.results?.filter((a) => a.deposit_paid).reduce((sum, a) => sum + a.deposit_amount, 0) ?? 0;

  const stats = [
    { label: "Total Appointments", value: total, icon: Calendar, color: "text-blue-600 bg-blue-50" },
    { label: "Completed", value: completed, icon: TrendingUp, color: "text-green-600 bg-green-50" },
    { label: "Pending", value: pending, icon: Calendar, color: "text-yellow-600 bg-yellow-50" },
    { label: "Portfolio Pieces", value: portfolioCount, icon: ImageIcon, color: "text-purple-600 bg-purple-50" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-yellow-600 bg-yellow-50" },
    { label: "Deposits Collected", value: `₹${Number(revenue).toLocaleString("en-IN")}`, icon: DollarSign, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}><Icon size={22} /></div>
            <div><p className="text-2xl font-display">{value}</p><p className="text-sm text-ink-500">{label}</p></div>
          </div>
        ))}
      </div>
      <div className="mt-8 card"><h3 className="text-lg font-display mb-4">Recent Activity</h3><p className="text-sm text-ink-400">Detailed charts and analytics coming soon. Check the Appointments tab for your recent booking history.</p></div>
    </div>
  );
}
