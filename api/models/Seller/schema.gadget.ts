import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "Seller" model, go to https://backup-njx.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "tgf2GBoVJbme",
  fields: {
    Locations: {
      type: "hasMany",
      children: { model: "Location", belongsToField: "seller" },
      storageKey: "gvjZSpU-gt3R",
    },
    User_Seller_Match: {
      type: "belongsTo",
      validations: { required: true, unique: true },
      parent: { model: "user" },
      storageKey: "JsNy_D4fY_z9",
    },
    authorization_Code: {
      type: "encryptedString",
      storageKey: "Faqx7_uOnV9e::String-Faqx7_uOnV9e",
    },
    isConnected: {
      type: "boolean",
      default: false,
      storageKey: "2ltk0eUUwQpU",
    },
    lastSyncedAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "2NRwf-w_Kz1I",
    },
    shopifyShopId: {
      type: "string",
      validations: { unique: true },
      storageKey: "CY2yekbZxo5p",
    },
    squareAccessToken: {
      type: "encryptedString",
      storageKey: "fy-vVgcl_fc4::String-fy-vVgcl_fc4",
    },
    squareAccountId: { type: "string", storageKey: "gSJb466JbiZN" },
    squareLocations: { type: "json", storageKey: "-Te2OVBhxkrH" },
    squareMerchantId: { type: "string", storageKey: "218MfepxJKc4" },
    squareRefreshToken: {
      type: "encryptedString",
      storageKey: "VmxBV9fdgJ9a::String-VmxBV9fdgJ9a",
    },
    squareTokenExpiresAt: {
      type: "dateTime",
      includeTime: true,
      storageKey: "Stq8T_vc6lKG",
    },
  },
};
