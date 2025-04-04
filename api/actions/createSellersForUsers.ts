import { ActionOptions } from "gadget-server";

export const run: ActionRun = async ({ api, logger }) => {
  try {
    // 1. Get all Users
    const usersResult = await api.query(`
      query GetAllUsers {
        users {
          edges {
            node {
              id
              email
            }
          }
        }
      }
    `);

    const users = usersResult.users.edges.map(edge => edge.node);

    // 2. Create Seller for each User
    for (const user of users) {
      const sellerResult = await api.mutate(`
        mutation CreateSellerForUser($userId: GadgetID!) {
          createSeller(Seller: {
            User_Seller_Match: {
              _link: $userId
            }
          }) {
            success
            errors {
              message
            }
            Seller {
              id
              User_Seller_Match {
                id
              }
            }
          }
        }
      `, {
        userId: user.id
      });

      if (!sellerResult?.createSeller?.success) {
        logger.error(`Failed to create Seller for user ${user.email}:`, sellerResult?.createSeller?.errors?.[0]?.message);
      } else {
        logger.info(`Created Seller for user ${user.email}`);
      }
    }
  } catch (error) {
    logger.error('Error creating Sellers:', error);
    throw error;
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  triggers: {},
}; 