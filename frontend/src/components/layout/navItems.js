import { Utensils, Clock, Inbox, History, Settings } from "lucide-react";

/** Shown to logged-in staff: just their own order flow. */
export const USER_NAV_ITEMS = [
  { key: "order", label: "Meal Order", icon: Utensils },
  { key: "myHistory", label: "My History", icon: History },
];

/** Shown to admins: oversight across every user's orders. */
export const ADMIN_NAV_ITEMS = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Inbox },
  { key: "history", label: "All History", icon: History },
  { key: "mealSettings", label: "Meal Settings", icon: Settings },
];