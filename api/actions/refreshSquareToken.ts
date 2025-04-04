import { ActionOptions } from "gadget-server";
import axios from "axios";

export const run: ActionRun = async ({ api, record, logger }) => {
  try {
    const refreshResponse = await axios.post(
      `https://connect.squareup.com/oauth2/token`,
      {
        client_id: process.env.SQUARE_CLIENT_ID,
        client_secret: process.env.SQUARE_CLIENT_SECRET,
        refresh_token: record.squareRefreshToken,
        grant_type: "refresh_token"
      }
    );

    const { access_token, refresh_token, expires_at } = refreshResponse.data;

    await api.updateSeller(record.id, {
      squareAccessToken: access_token,
      squareRefreshToken: refresh_token,
      squareTokenExpiresAt: expires_at
    });

    return { success: true };
    
  } catch (error) {
    logger.error({ error }, "Error refreshing Square token");
    return {
      success: false,
      errors: [{ message: error.message }]
    };
  }
}; 