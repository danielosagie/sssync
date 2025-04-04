import { ActionOptions, applyParams, save } from "gadget-server";

  // Helper function to refresh tokens
export const refreshSquareToken = async (context, seller) => {
  const tokenResponse = await fetch("https://connect.squareup.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Client ${process.env.SQUARE_APP_SECRET}`
    },
    body: JSON.stringify({
      client_id: process.env.SQUARE_APP_ID,
      client_secret: process.env.SQUARE_APP_SECRET,
      refresh_token: seller.squareRefreshToken,
      grant_type: "refresh_token"
    })
  });

  const { access_token, refresh_token, expires_at } = await tokenResponse.json();

  await context.api.seller.updateSquareTokens({
    where: { id: seller.id },
    data: {
      squareAccessToken: access_token,
      squareRefreshToken: refresh_token,
      squareTokenExpiresAt: expires_at
    }
  });

  return access_token;
};


export const options: ActionOptions = {
  actionType: "update",
  params: {
    squareAccessToken: {
      type: "string",
      required: true
    },
    squareRefreshToken: {
      type: "string",
      required: true
    },
    squareTokenExpiresAt: {
      type: "datetime",
      required: true
    },
  }
};

