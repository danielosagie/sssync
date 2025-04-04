import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ params, api }) => {
  const locations = await api.location.findMany({
    filter: {
      seller: { id: { equals: params.sellerId } }
    }
  });

  return locations;
};

export const options: ActionOptions = {
  actionType: "list",
  params: {
    sellerId: {
      type: "string",
      required: true
    }
  }
};
