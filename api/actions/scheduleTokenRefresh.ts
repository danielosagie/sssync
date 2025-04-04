import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api }) => {
  // Schedule the refresh to run daily at 2 AM UTC
  const nextRun = new Date();
  nextRun.setUTCHours(2, 0, 0, 0);
  if (nextRun < new Date()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  await api.enqueue(api.refreshSquareTokens, {}, {
    startAt: nextRun.toISOString(),
    queue: "scheduled-tasks"
  });

  return { success: true };
}; 