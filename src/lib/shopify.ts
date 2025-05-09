export async function getShopifyProductPrice(shop: string, productId: string) {
  const endpoint = `https://${shop}/api/2023-10/graphql.json`;
  const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        title
        variants(first: 1) {
          edges {
            node {
              price {
                amount
              }
            }
          }
        }
      }
    }
  `;

  const productGid = `gid://shopify/Product/${productId}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({
      query,
      variables: { id: productGid },
    }),
  });

  const json = await res.json();
  const amount = json?.data?.product?.variants?.edges?.[0]?.node?.price?.amount;

  return amount ? parseFloat(amount).toFixed(2) : null;
}
