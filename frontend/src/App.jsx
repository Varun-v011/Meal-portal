import React, { useState } from "react";
import "./styles/tokens.css";
import { UserLayout, AdminLayout } from "./layouts";
import { AuthPage, MealOrderPage, HistoryPage, ConfirmedPage, PendingPage } from "./pages";

const USER_TITLES = {
  order: { title: "Meal order", subtitle: "Friday, 11 September 2026" },
  myHistory: { title: "My history", subtitle: "Your past orders and their status" },
};

const ADMIN_TITLES = {
  pending: { title: "Pending orders", subtitle: "Awaiting confirmation" },
  confirmed: { title: "Confirmed today", subtitle: "Friday, 11 September 2026" },
  history: { title: "All order history", subtitle: "Every staff member's orders" },
};

export default function App() {
  // auth = null (logged out) | "user" | "admin"
  const [auth, setAuth] = useState(null);
  const [userPage, setUserPage] = useState("order");
  const [adminPage, setAdminPage] = useState("pending");

  const handleLogin = (role) => setAuth(role);
  const handleLogout = () => setAuth(null);

  if (!auth) {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (auth === "admin") {
    const { title, subtitle } = ADMIN_TITLES[adminPage];
    return (
      <AdminLayout page={adminPage} setPage={setAdminPage} onLogout={handleLogout} title={title} subtitle={subtitle}>
        {adminPage === "pending" && <PendingPage />}
        {adminPage === "confirmed" && <ConfirmedPage />}
        {adminPage === "history" && <HistoryPage title="All staff order history" showEmployeeColumn />}
      </AdminLayout>
    );
  }

  // auth === "user"
  const { title, subtitle } = USER_TITLES[userPage];
  return (
    <UserLayout page={userPage} setPage={setUserPage} onLogout={handleLogout} title={title} subtitle={subtitle}>
      {userPage === "order" && <MealOrderPage />}
      {userPage === "myHistory" && <HistoryPage title="My order history" showEmployeeColumn={false} />}
    </UserLayout>
  );
}
