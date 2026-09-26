import type { DashboardStats, MessageThread } from "@/types";

export const INITIAL_DASHBOARD_STATS: DashboardStats = {
  total_tattoos: 7420,
  upcoming_bookings: 5,
  pending_requests: 2,
  portfolio_items: 222,
  total_reviews: 462,
  average_rating: 5.0,
  healed_satisfaction_rate: "99.9%",
  estimated_monthly_revenue: 185000,
  active_collectors: 148,
};

export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: "msg-1",
    customer_name: "Aarav Sharma",
    customer_phone: "+91 98251 44321",
    customer_email: "aarav.sharma@example.com",
    tattoo_concept: "Lord Shiva Trishul Forearm",
    preferred_style: "Spiritual Realism",
    last_message: "Jainik bhai, the stencil placement on the forearm looks incredible! When should I arrive?",
    last_updated: "2026-09-22T10:30:00Z",
    unread: true,
    messages: [
      {
        id: "m-1",
        sender: "client",
        text: "Namaste Jainik bhai! I submitted the booking form for the Lord Shiva Trishul piece.",
        timestamp: "2026-09-21T09:30:00Z",
      },
      {
        id: "m-2",
        sender: "artist",
        text: "Namaste Aarav! I reviewed your concept. I recommend placing the Damru at the mid-flexor for maximum anatomical flow.",
        timestamp: "2026-09-21T10:15:00Z",
      },
      {
        id: "m-3",
        sender: "client",
        text: "Jainik bhai, the stencil placement on the forearm looks incredible! When should I arrive?",
        timestamp: "2026-09-22T10:30:00Z",
      },
    ],
  },
  {
    id: "msg-2",
    customer_name: "Pooja Vaghela",
    customer_phone: "+91 97241 88910",
    customer_email: "pooja.v@example.com",
    tattoo_concept: "Lotus Mandala Spine Inking",
    preferred_style: "Fine Line",
    last_message: "Deposit transfer of ₹1,500 completed via UPI! See you in Rajpipla on 25th.",
    last_updated: "2026-09-20T15:00:00Z",
    unread: false,
    messages: [
      {
        id: "m-21",
        sender: "client",
        text: "Hello! Is home service available for a spine mandala in Rajpipla?",
        timestamp: "2026-09-20T14:15:00Z",
      },
      {
        id: "m-22",
        sender: "artist",
        text: "Yes Pooja! We provide full sterile doorstep service in Rajpipla with portable medical setup.",
        timestamp: "2026-09-20T14:40:00Z",
      },
      {
        id: "m-23",
        sender: "client",
        text: "Deposit transfer of ₹1,500 completed via UPI! See you in Rajpipla on 25th.",
        timestamp: "2026-09-20T15:00:00Z",
      },
    ],
  },
  {
    id: "msg-3",
    customer_name: "Vikram Rathore",
    customer_phone: "+91 94280 77654",
    customer_email: "vikram.rathore@example.com",
    tattoo_concept: "Imperial Lion Dark Realism",
    preferred_style: "Dark Realism",
    last_message: "Traveling from Surat early morning on the 26th. See you at the Bhadam studio.",
    last_updated: "2026-09-19T11:20:00Z",
    unread: false,
    messages: [
      {
        id: "m-31",
        sender: "client",
        text: "Traveling from Surat early morning on the 26th. See you at the Bhadam studio.",
        timestamp: "2026-09-19T11:20:00Z",
      },
    ],
  },
];
