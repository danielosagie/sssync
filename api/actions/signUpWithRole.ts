import { ActionOptions } from "gadget-server";

/**
 * This action creates a user with the appropriate role based on their email,
 * and also creates a linked Seller record for the user.
 * 
 * Note: This functionality might be better handled directly through the standard 
 * user.signUp flow if that has been enhanced with proper role assignment.
 */
export const run: ActionRun = async ({ api, params, logger }) => {
  try {
    const { email, password, shopifyEmail } = params;
    
    // Determine the appropriate role based on email
    const roles = email === shopifyEmail ? ["signed-in", "shopify-app-users"] : ["signed-in"];

    // 1. Create User with appropriate role
    logger.info(`Creating user with email: ${email}`);
    const userResult = await api.user.signUp({
      email,
      password,
      roles
    });

    if (!userResult?.id) {
      throw new Error('User creation failed');
    }

    // 2. Create Seller linked to the User
    logger.info(`Creating seller for user: ${userResult.id}`);
    const sellerResult = await api.Seller.create({
      User_Seller_Match: {
        _link: userResult.id
      }
    });

    if (!sellerResult?.id) {
      throw new Error('Seller creation failed');
    }

    return {
      success: true,
      user: userResult,
      seller: sellerResult
    };
    
  } catch (error) {
    logger.error('Error during signup:', error);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  params: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
    shopifyEmail: {
      type: "string",
      required: true,
    },
  },
  triggers: { api: true },
}; 