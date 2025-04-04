import { useContext } from "react";
import { AuthContext } from "../providers";
import { SettingsPageComponent } from "../components/components-settings-page";
import { useUser } from "@gadgetinc/react";

export default function Settings() {
  const { user } = useUser();

  return (
    <div className="w-full">
      <h1>Settings</h1>
      <p>User ID: {user?.id}</p>
      <SettingsPageComponent />
    </div>
  );
} 