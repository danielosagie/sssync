import crypto from "crypto";

/**
 * @param { import("gadget-server").ActionContext } context
 */
export async function run({ api, logger, params, session }) {
  try {
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store state in session for verification
    await session.set({
      squareAuthState: state
    });

    // Ensure the redirect URI is set correctly
    const redirectUri = 'https://sssync8--development.gadget.app/api/square/callback';

    const authUrl = `https://connect.squareup.com/oauth2/authorize?` +
      `client_id=${process.env.SQUARE_APPLICATION_ID}&` +
      `scope=ITEMS_READ MERCHANT_PROFILE_READ INVENTORY_READ INVENTORY_WRITE&` +
      `session=false&` +
      `state=${state}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}`;

    return {
      success: true,
      result: {
        authUrl,
        state
      }
    };
  } catch (error) {
    logger.error('Error in initiateSquareAuth:', error);
    return {
      success: false,
      errors: [{
        message: error.message,
        code: 'SQUARE_AUTH_ERROR'
      }]
    };
  }
}
                                                                  