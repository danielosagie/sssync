import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api }) => {
  await api.enqueue(api.scheduleTokenRefresh, {});
  return { success: true };
}; 