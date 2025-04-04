import { useUser } from "@gadgetinc/react";
import { DashboardComponent } from "../components/components-dashboard";
import { useContext } from "react";
import { AuthContext, ShopContext } from "../providers";

export default function SyncDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Sync Dashboard</h1>
      <p>User ID: {user?.id}</p>
      <DashboardComponent />
    </div>
  );
} 