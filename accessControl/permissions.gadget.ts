import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://backup-njx.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "signed-in": {
      storageKey: "signed-in",
      default: {
        read: true,
        action: true,
      },
      models: {
        Location: {
          read: true,
          actions: {
            create: true,
            delete: true,
            getLocationById: true,
            listLocationsBySeller: true,
            mapToShopify: true,
            update: true,
            updateProducts: true,
          },
        },
        Seller: {
          read: true,
          actions: {
            create: true,
            disconnectSquare: true,
            SellerByShopId: true,
            updateLocations: true,
            updateSquareTokens: true,
          },
        },
        shopifyApp: {
          read: true,
        },
        shopifyAppCredit: {
          read: true,
        },
        shopifyAppInstallation: {
          read: true,
        },
        shopifyAppPurchaseOneTime: {
          read: true,
        },
        shopifyAppSubscription: {
          read: true,
        },
        shopifyAppUsageRecord: {
          read: true,
        },
        shopifyBulkOperation: {
          read: true,
        },
        shopifyBusinessEntity: {
          read: true,
        },
        shopifyDomain: {
          read: true,
        },
        shopifyFile: {
          read: true,
        },
        shopifyFulfillment: {
          read: true,
        },
        shopifyFulfillmentEvent: {
          read: true,
        },
        shopifyFulfillmentLineItem: {
          read: true,
        },
        shopifyGdprRequest: {
          read: true,
        },
        shopifyInventoryItem: {
          read: true,
        },
        shopifyInventoryLevel: {
          read: true,
        },
        shopifyLocation: {
          read: true,
        },
        shopifyOrder: {
          read: true,
        },
        shopifyOrderAdjustment: {
          read: true,
        },
        shopifyOrderLineItem: {
          read: true,
        },
        shopifyProduct: {
          read: true,
        },
        shopifyProductMedia: {
          read: true,
        },
        shopifyProductOption: {
          read: true,
        },
        shopifyProductVariant: {
          read: true,
        },
        shopifyProductVariantMedia: {
          read: true,
        },
        shopifyRefund: {
          read: true,
        },
        shopifyRefundDuty: {
          read: true,
        },
        shopifyRefundLineItem: {
          read: true,
        },
        shopifyShop: {
          read: {
            filter: "accessControl/filters/shopifyShop/tenancy.gelly",
          },
        },
        shopifySync: {
          read: true,
        },
        shopPermission: {
          read: true,
          actions: {
            delete: true,
          },
        },
        user: {
          read: {
            filter: "accessControl/filters/user/tenant.gelly",
          },
          actions: {
            changePassword: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            createSellerOnUserCreate: true,
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signOut: {
              filter: "accessControl/filters/user/tenant.gelly",
            },
            signUp: true,
            verifyEmail: true,
          },
        },
      },
      actions: {
        createSellersForUsers: true,
        scheduledShopifySync: true,
        signUpWithRole: true,
        squareOAuth: true,
        verifyConnections: true,
      },
    },
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        shopifyAppCredit: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyAppCredit.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyAppInstallation: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyAppInstallation.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyAppPurchaseOneTime: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyAppPurchaseOneTime.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyAppSubscription: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyAppSubscription.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyBulkOperation: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyBulkOperation.gelly",
          },
          actions: {
            cancel: true,
            complete: true,
            create: true,
            expire: true,
            fail: true,
            update: true,
          },
        },
        shopifyBusinessEntity: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyBusinessEntity.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyDomain: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyDomain.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyFile: {
          read: {
            filter: "accessControl/filters/shopify/shopifyFile.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyFulfillment: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyFulfillment.gelly",
          },
        },
        shopifyFulfillmentEvent: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyFulfillmentEvent.gelly",
          },
        },
        shopifyFulfillmentLineItem: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyFulfillmentLineItem.gelly",
          },
        },
        shopifyGdprRequest: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyGdprRequest.gelly",
          },
          actions: {
            create: true,
            update: true,
          },
        },
        shopifyInventoryItem: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyInventoryItem.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyInventoryLevel: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyInventoryLevel.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyLocation: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyLocation.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyOrder: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrder.gelly",
          },
        },
        shopifyOrderAdjustment: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrderAdjustment.gelly",
          },
        },
        shopifyOrderLineItem: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrderLineItem.gelly",
          },
        },
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProduct.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyProductMedia: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductMedia.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyProductOption: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductOption.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyProductVariant: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductVariant.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyProductVariantMedia: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductVariantMedia.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyRefund: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyRefund.gelly",
          },
        },
        shopifyRefundDuty: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyRefundDuty.gelly",
          },
        },
        shopifyRefundLineItem: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyRefundLineItem.gelly",
          },
        },
        shopifyShop: {
          read: {
            filter: "accessControl/filters/shopify/shopifyShop.gelly",
          },
          actions: {
            install: true,
            reinstall: true,
            uninstall: true,
            update: true,
          },
        },
        shopifySync: {
          read: {
            filter: "accessControl/filters/shopify/shopifySync.gelly",
          },
          actions: {
            abort: true,
            complete: true,
            error: true,
            run: true,
          },
        },
        user: {
          actions: {
            changePassword: true,
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signOut: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      models: {
        user: {
          actions: {
            resetPassword: true,
            sendResetPassword: true,
            sendVerifyEmail: true,
            signIn: true,
            signUp: true,
            verifyEmail: true,
          },
        },
      },
    },
  },
};
