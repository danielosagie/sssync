import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api, params, logger }) => {
  try {
    const { shopifyShopId } = params;

    const shopifyResult = await api.query(`
      query GetShopifyShop($id: GadgetID!) {
        shopifyShop(id: $id) {
          email
        }
      }
    `, {
      id: shopifyShopId
    });

    const shopifyShop = shopifyResult.shopifyShop;
    if (!shopifyShop) {
      throw new Error("Shopify shop not found");
    }

    var email = shopifyShop.email
    console.log(email)

    return {
      success: true,
      email: email
    };
    
    email = shopifyShop.email
    console.log(email)
    
  } catch (error) {
    logger.error('Error fetching Shopify shop email:', error);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  params: {
    shopifyShopId: {
      type: "string",
      required: true
    }
  }
}; 