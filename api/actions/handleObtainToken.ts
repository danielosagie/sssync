import { useContext } from "react";
import { ShopContext, AuthContext } from "../../web/providers";
import axios from "axios";
import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api, logger, connections }: ActionOptions) => {
  try {
    logger.info("Starting token validation");
    
    const { user } = useContext(AuthContext);
    const { shops } = useContext(ShopContext);

    // Check if we have a valid token
    const seller = await api.seller.findFirst({
      filter: {
        id: { equals: user.id }
      },
      select: {
        id: true,
        squareAccessToken: true,
        squareTokenExpiresAt: true,
        squareRefreshToken: true
      }
    });

    if (!seller) {
      logger.error("Seller not found");
      throw new Error("Seller not found");
    }

    if (seller.squareAccessToken && new Date(seller.squareTokenExpiresAt) > new Date()) {
      logger.info("Token is valid");
      return { isValid: true };
    }

    logger.info("Token expired, refreshing");
    const refreshResponse = await axios.post(
      `https://connect.squareup.com/oauth2/token`,
      {
        client_id: process.env.SQUARE_CLIENT_ID,
        client_secret: process.env.SQUARE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: seller.squareRefreshToken
      }
    );

    const { access_token, refresh_token, expires_at } = refreshResponse.data;

    await api.seller.update(seller.id, {
      squareAccessToken: access_token,
      squareRefreshToken: refresh_token,
      squareTokenExpiresAt: expires_at
    });

    logger.info("Token refreshed successfully");
    return { isValid: true };
  } catch (error) {
    logger.error({ error }, "Error handling token");
    return { isValid: false, error: error.message };
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  transactional: false
};
