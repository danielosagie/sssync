import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyLocation" model, go to https://backup-njx.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Location",
  fields: {},
  shopify: {
    fields: [
      "active",
      "address1",
      "address2",
      "city",
      "country",
      "countryCode",
      "fulfillments",
      "inventoryItems",
      "legacy",
      "localizedCountryName",
      "localizedProvinceName",
      "name",
      "orderLineItems",
      "orders",
      "phone",
      "province",
      "provinceCode",
      "refundedLineItems",
      "retailOrders",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "zipCode",
    ],
  },
};
