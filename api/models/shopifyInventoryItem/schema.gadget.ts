import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyInventoryItem" model, go to https://backup-njx.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-InventoryItem",
  fields: {
    productVariant: {
      type: "hasOne",
      child: {
        model: "shopifyProductVariant",
        belongsToField: "inventoryItem",
      },
      storageKey:
        "ModelField-DataModel-Shopify-InventoryItem-3TrFSOh82poB::FieldStorageEpoch-DataModel-Shopify-InventoryItem-wO2eOMghXi5Q-initial",
    },
  },
  shopify: {
    fields: [
      "cost",
      "countryCodeOfOrigin",
      "countryHarmonizedSystemCodes",
      "duplicateSkuCount",
      "harmonizedSystemCode",
      "inventoryHistoryUrl",
      "legacyResourceId",
      "locations",
      "measurement",
      "provinceCodeOfOrigin",
      "requiresShipping",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "sku",
      "tracked",
      "trackedEditable",
      "unitCost",
    ],
  },
};
