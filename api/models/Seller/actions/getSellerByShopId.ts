import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, api }) => {
  const seller = await api.seller.findFirst({
    filter: {
      shopifyShopId: { equals: params.shopifyShopId }
    }
  });

  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller;
};

export const options: ActionOptions = {
  actionType: "get",
  params: {
    shopifyShopId: {
      type: "string",
      required: true
    }
  }
};

