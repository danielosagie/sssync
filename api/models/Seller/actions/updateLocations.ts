import { ActionOptions } from "gadget-server";
import axios from "axios";
import { logger } from "gadget-server";
import { RouteHandler } from "gadget-server";
import { AuthContext, ShopContext } from "../../../web/providers";

export const run: ActionRun = async ({ request, api, record, logger, connections }: ActionOptions) => {
  try {
    const { user } = useContext(AuthContext);
    const { shops } = useContext(ShopContext);
    
    logger.info("Starting location update for seller", { sellerId: record.id });
    
    const seller = await api.seller.findBy(record.id, {
      select: {
        squareMerchantId: true,
        squareAccessToken: true
      }
    });

    if (!seller.squareMerchantId || !seller.squareAccessToken) {
      logger.error("Missing merchant ID or access token");
      throw new Error("Missing merchant ID or access token");
    }

    const response = await axios.post(
      "https://connect.squareup.com/graphql",
      {
        query: `
          query MerchantsQuery($merchantId: ID!) {
            merchants(filter: { id: { equalToAnyOf: [$merchantId] } }) {
              nodes {
                id
                country
                businessName
                currency
                language
                locations {
                  nodes {
                    id
                    businessEmail
                    businessName
                    createdAt
                    description
                    name
                  }
                }
                mainLocation {
                  id
                }
                status
              }
            }
          }
        `,
        variables: {
          merchantId: seller.squareMerchantId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${seller.squareAccessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const locations = response.data.data.merchants.nodes[0].locations.nodes;
    logger.info(`Found ${locations.length} locations to update`);

    for (const location of locations) {
      await api.location.upsert({
        where: {
          squareLocationId: location.id
        },
        create: {
          squareLocationId: location.id,
          businessName: location.businessName,
          name: location.name,
          description: location.description,
          seller: {
            _link: record.id
          }
        },
        update: {
          businessName: location.businessName,
          name: location.name,
          description: location.description
        }
      });
    }

    logger.info("Locations updated successfully");
    return { success: true };
  } catch (error) {
    logger.error({ error }, "Error updating locations");
    return { success: false, error: error.message };
  }
};

export const options: ActionOptions = {
  actionType: "custom",
  transactional: false
};
