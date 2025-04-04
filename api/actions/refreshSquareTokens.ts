import { ActionOptions } from "gadget-server";
import axios from "axios";

export const run: ActionRun = async ({ api, logger }) => {
  try {
    // Find sellers with tokens expiring soon
    const sellers = await api.seller.findMany({
      filter: {
        squareTokenExpiresAt: { lessThan: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      }
    });

    // Enqueue a refresh action for each seller
    for (const seller of sellers) {
      await api.enqueue(api.refreshSquareToken, { id: seller.id }, {
        queue: "token-refresh",
        retries: 3 // Retry up to 3 times if it fails
      });
    }

    return { success: true };
    
  } catch (error) {
    logger.error({ error }, "Error in token refresh action");
    return {
      success: false,
      errors: [{ message: error.message }]
    };
  }
}; 