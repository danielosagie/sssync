import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api, record, logger, connections, trigger }) => {
  try {
    logger.info("Creating Seller for new user", { userId: record.id, triggerType: trigger?.type });

    // Create a Seller record linked to the user
    const sellerResult = await api.Seller.create({
      User_Seller_Match: {
        _link: record.id
      },
      isConnected: false
    }, {
      select: {
        id: true,
        User_Seller_Match: {
          id: true
        }
      }
    });

    logger.info("Seller created successfully", { 
      sellerId: sellerResult.id,
      userId: sellerResult.User_Seller_Match?.id 
    });
    
    return sellerResult;
  } catch (error) {
    logger.error("Error creating Seller for user", { 
      error: error instanceof Error ? error.message : String(error),
      userId: record.id 
    });
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
  triggers: {
    "google oauth sign up": true,
    "email password sign up": true
  },
}; 