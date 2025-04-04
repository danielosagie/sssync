const queryString = `{
    products (first: 3) {
      edges {
        node {
          id
          title
        }
      }
    }
  }`
  
  // `session` is built as part of the OAuth process
  const client = new shopify.clients.Graphql({session});
  const products = await client.query({
    data: queryString,
  });
      