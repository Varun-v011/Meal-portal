import React, { useState } from "react";
import "./styles/tokens.css";
import { UserLayout, AdminLayout } from "./layouts";
import { AuthPage, MealOrderPage, HistoryPage, ConfirmedPage, PendingPage, MealSettingsPage } from "./pages";

/** Today's date as "Friday, 11 September 2026". */
function formatTodayLong() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const USER_TITLES = {
  order: { title: "Meal Order", subtitle: formatTodayLong() },
  myHistory: { title: "History", subtitle: "Your past orders and their status" },
};

const ADMIN_TITLES = {
  pending: { title: "Pending Orders", subtitle: "Awaiting Confirmation" },
  confirmed: { title: "Confirmed Orders" },
  history: { title: "All Order History",},
  mealSettings: { title: "Meal Settings", subtitle: "Availability, Pricing, and Closing times" },
};

export default function App() {
  // currentUser = null (logged out) | user object returned by /api/login
  const [currentUser, setCurrentUser] = useState(() => {
  const saved = localStorage.getItem("currentUser");
  return saved ? JSON.parse(saved) : null;
  });
  const [userPage, setUserPage] = useState("order");
  const [adminPage, setAdminPage] = useState("pending");

const handleLogin = (user) => {
  setCurrentUser(user);
  localStorage.setItem("currentUser", JSON.stringify(user));
};
const handleLogout = () => {
  setCurrentUser(null);
  localStorage.removeItem("currentUser");
};

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const auth = currentUser.role; // "admin" | "staff"

  if (auth === "admin") {
    const { title, subtitle } = ADMIN_TITLES[adminPage];
    return (
      <AdminLayout
        page={adminPage}
        setPage={setAdminPage}
        onLogout={handleLogout}
        title={title}
        subtitle={subtitle}
        userName={currentUser.name}
        userRole="Administrator"
        userMobile={currentUser.mobile_number}
      >
        {adminPage === "pending" && <PendingPage adminId={currentUser.id} />}
        {adminPage === "confirmed" && <ConfirmedPage adminId={currentUser.id} />}
        {adminPage === "history" && <HistoryPage title="All Order History" showEmployeeColumn currentUserId={currentUser.id} hidePending />}
        {adminPage === "mealSettings" && <MealSettingsPage adminId={currentUser.id} />}
      </AdminLayout>
    );
  }

  // auth === "staff"
  const { title, subtitle } = USER_TITLES[userPage];
  return (
    <UserLayout
      page={userPage}
      setPage={setUserPage}
      onLogout={handleLogout}
      title={title}
      subtitle={subtitle}
      userName={currentUser.name}
      userRole={currentUser.department || "Staff"}
      userMobile={currentUser.mobile_number}
    >
      {userPage === "order" && <MealOrderPage userId={currentUser.id} />}
      {userPage === "myHistory" && <HistoryPage title="My order history" showEmployeeColumn={false} currentUserId={currentUser.id} showSearch={false} showFilters={false} />}
    </UserLayout>
  );
}