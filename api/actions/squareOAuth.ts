import { ActionOptions } from "gadget-server";
import crypto from "crypto";

// Define the params object to accept any necessary parameters
export const params = {
  // Add any required parameters here
};

export const run: ActionRun = async ({ api, logger, connections }) => {
  try {
    // Generate the Square OAuth URL
    const clientId = process.env.SQUARE_CLIENT_ID;
    const redirectUri = process.env.SQUARE_REDIRECT_URI || "https://sssyncnjx2--development.gadget.app/callback";
    const environment = process.env.SQUARE_ENVIRONMENT || "production";
    
    if (!clientId) {
      throw new Error("Missing Square OAuth configuration: SQUARE_CLIENT_ID is required");
    }

    // Set base URL based on environment
    const baseUrl = environment === "production" 
      ? "https://connect.squareup.com" 
      : "https://connect.squareupsandbox.com";

    // Define required scopes
    const scopes = [
      "PAYMENTS_READ",
      "ORDERS_READ", 
      "MERCHANT_PROFILE_READ",
      "INVENTORY_READ",
      "INVENTORY_WRITE",
      "ITEMS_READ",
      "ITEMS_WRITE",
      "ORDERS_WRITE"
    ].join("+");

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    const authUrl = `${baseUrl}/oauth2/authorize?` +
      `client_id=${clientId}&` +
      `scope=${scopes}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `session=false`;

    return {
      success: true,
      result: { authUrl }
    };
    
  } catch (error) {
    logger.error({ error }, "Error generating Square OAuth URL");
    return {
      success: false,
      errors: [{ message: error.message }]
    };
  }
};

export const options: ActionOptions = {
  returnType: true, // Enable returning a value from the run function
};
