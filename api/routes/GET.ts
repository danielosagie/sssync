// get.ts
import { RouteHandler } from "gadget-server";

const route: RouteHandler = async ({ request, reply, connections }) => {
  // Check if user is authenticated via Shopify connection
  const shopId = connections.shopify.currentShop;
  
  // Redirect based on authentication status
  if (shopId) {
    return reply.redirect("/home"); // Authenticated users
  }

  return reply.redirect("/home"); // Not authenticated
};

export default route;
