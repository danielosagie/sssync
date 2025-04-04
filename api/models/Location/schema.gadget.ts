import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "Location" model, go to https://backup-njx.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "yANsWeAAnSqU",
  fields: {
    businessName: { type: "string", storageKey: "gdPNJWru3Uf5" },
    description: { type: "string", storageKey: "QeL291OJhIPy" },
    inventory: { type: "json", storageKey: "7HpfnDbCl4so" },
    name: { type: "string", storageKey: "2I1ylvpfFZzE" },
    products: { type: "json", storageKey: "eyLgisxvXfrd" },
    seller: {
      type: "belongsTo",
      parent: { model: "Seller" },
      storageKey: "V3_q5vpIoxpX",
    },
    shopifyLocationId: { type: "string", storageKey: "XhENWt-HPVpb" },
    squareLocationId: {
      type: "string",
      validations: { unique: true },
      storageKey: "Eyhzyqs1v4Av",
    },
    status: {
      type: "string",
      default: "active",
      storageKey: "1jEkoRi0SyV1",
    },
  },
};
