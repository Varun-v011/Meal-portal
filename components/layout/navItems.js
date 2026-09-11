import { Utensils, Clock, Inbox, Search } from "lucide-react";

const NAV_ITEMS = [
  { key: "order", label: "New Order", icon: Utensils },
  { key: "history", label: "History", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: Inbox },
  { key: "pending", label: "Pending", icon: Clock },
  { key: "loading", label: "Loading", icon: Search },
];

export default NAV_ITEMS;
