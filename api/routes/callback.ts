import { RouteContext } from "gadget-server";
import axios from "axios";
import { AuthContext, ShopContext } from "../../web/providers";
import { useContext } from "react";

export default async function route({ request, reply, api, logger, connections }: RouteContext) {
  try {
    const { code, state } = request.query;
    const { user } = useContext(AuthContext);
    const { shops } = useContext(ShopContext);

    
    if (!code) {
      logger.error("Missing authorization code");
      return reply.status(400).send({ error: "Missing authorization code" });
    }

    // Exchange code for tokens
    const tokenResponse = await axios.post(
      `https://connect.squareup.com/oauth2/token`,
      {
        client_id: process.env.SQUARE_CLIENT_ID,
        client_secret: process.env.SQUARE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      }
    );

    const { access_token, refresh_token, expires_at, merchant_id } = tokenResponse.data;
    logger.info("Successfully obtained tokens", { merchant_id });

    // Update seller record
    const updateResult = await api.mutate(`
      mutation UpdateSeller($Seller: UpdateSellerInput!, $id: GadgetID!) {
        updateSeller(Seller: $Seller, id: $id) {
          success
          errors {
            message
          }
        }
      }
    `, {
      Seller: {
        squareAccessToken: access_token,
        squareRefreshToken: refresh_token,
        squareTokenExpiresAt: expires_at,
        squareMerchantId: merchant_id,
        isConnected: true
      },
      id: user.id
    });

    if (!updateResult.updateSeller?.success) {
      logger.error({ errors: updateResult.updateSeller?.errors }, "Failed to update seller");
      return reply.status(500).send({ error: "Failed to update seller record" });
    }

    logger.info("Seller record updated successfully");

    // Return HTML to close the window and notify the parent window
    return reply.type('text/html').send(`
      <html>
        <script>
          window.onload = function() {
            if (window.opener) {
              window.opener.postMessage({
                type: 'square-auth-success',
                merchantId: '${merchant_id}'
              }, '*');
            }
            window.close();
          }
        </script>
        <body>
          <p>Authentication successful! You can close this window.</p>
        </body>
      </html>
    `);
    
  } catch (error) {
    logger.error({ error }, "Error handling OAuth callback");
    return reply.status(500).send({ error: "Failed to handle OAuth callback" });
  }
} 