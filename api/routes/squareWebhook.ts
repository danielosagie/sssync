import { RouteContext } from "gadget-server";

export default async function route({ request, reply, api, logger }: RouteContext) {
  try {
    const { merchant_id } = request.body;
    
    // Find seller by merchant ID
    const seller = await api.seller.findMany({
      filter: {
        squareMerchantId: { equals: merchant_id }
      }
    });

    if (seller) {
      await api.updateSeller(seller.id, {
        squareAccessToken: null,
        squareRefreshToken: null,
        squareTokenExpiresAt: null,
        isConnected: false
      });
    }

    return reply.send({ success: true });
    
  } catch (error) {
    logger.error({ error }, "Error handling Square webhook");
    return reply.status(500).send({ error: "Internal server error" });
  }
} 