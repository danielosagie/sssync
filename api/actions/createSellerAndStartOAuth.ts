import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api, record, logger }) => {
  try {
    const userId = record.id;

    // 1. Create Seller
    const sellerResult = await api.mutate(`
      mutation CreateSeller($userId: GadgetID!) {
        createSeller(Seller: {
          User_Seller_Match: {
            _link: $userId
          }
        }) {
          success
          errors {
            message
          }
          Seller {
            id
          }
        }
      }
    `, {
      userId: userId
    });

    if (!sellerResult?.createSeller?.success) {
      throw new Error(sellerResult?.createSeller?.errors?.[0]?.message || 'Seller creation failed');
    }

    // 2. Start SquareOAuth
    const squareOAuthResult = await api.mutate(`
      mutation SquareOAuth($userId: GadgetID!) {
        squareOAuth(userId: $userId) {
          success
          authUrl
        }
      }
    `, {
      userId: userId
    });

    if (!squareOAuthResult?.squareOAuth?.success) {
      throw new Error("Failed to start Square OAuth");
    }

    return {
      success: true,
      authUrl: squareOAuthResult.squareOAuth.authUrl
    };
  } catch (error) {
    logger.error('Error in createSellerAndStartOAuth:', error);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  triggers: {
    user: {
      after: {
        create: true
      }
    }
  }
}; 