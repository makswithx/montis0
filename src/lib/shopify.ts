import { toast } from "sonner";

// Shopify API Configuration
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'jmaigw-yn.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '8fc561182c41cbb566706100b4c44821';

// Metafield types for perfume products
export interface ProductMetafields {
  gender?: 'men' | 'women' | 'unisex';
  fragranceType?: 'EDP' | 'EDT' | 'Parfum' | 'Extrait';
  notesFamily?: 'woody' | 'floral' | 'oriental' | 'fresh' | 'citrus' | 'spicy';
  isSignature?: boolean;
  season?: 'summer' | 'spring' | 'autumn' | 'winter';
}

// TypeScript interfaces
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    vendor: string;
    productType: string;
    createdAt: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
      maxVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          compareAtPrice: {
            amount: string;
            currencyCode: string;
          } | null;
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    // Metafields
    gender: { value: string } | null;
    fragranceType: { value: string } | null;
    notesFamily: { value: string } | null;
    isSignature: { value: string } | null;
    season: { value: string } | null;
  };
}

// Filter types - All filters use tags for server-side filtering
// Tag format: gender_men, gender_women, gender_unisex
//             type_EDP, type_EDT, type_Parfum
//             season_summer, season_spring, season_autumn, season_winter
//             signature_true
export interface ProductFilters {
  genders?: string[];      // Tag: gender_*
  vendor?: string;         // product.vendor (native field)
  fragranceTypes?: string[]; // Tag: type_*
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];        // Variant option: Size
  sortKey?: 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'TITLE';
  reverse?: boolean;
  isSignature?: boolean;   // Tag: signature_true
  season?: string;         // Tag: season_*
  tags?: string[];         // Direct tag query
}

// GraphQL fragment for product fields
const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    description
    handle
    vendor
    productType
    createdAt
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
    options {
      name
      values
    }
    gender: metafield(namespace: "custom", key: "gender") {
      value
    }
    fragranceType: metafield(namespace: "custom", key: "fragrance_type") {
      value
    }
    notesFamily: metafield(namespace: "custom", key: "notes_family") {
      value
    }
    isSignature: metafield(namespace: "custom", key: "is_signature") {
      value
    }
    season: metafield(namespace: "custom", key: "season") {
      value
    }
  }
`;

// GraphQL Queries
const STOREFRONT_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges {
        node {
          ...ProductFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

const VENDORS_QUERY = `
  query GetVendors($first: Int!) {
    products(first: $first) {
      edges {
        node {
          vendor
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Storefront API helper function
export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

// Build query string from filters using TAGS for server-side filtering
// This ensures scalability to 3-5k products without client-side filtering
function buildQueryString(filters: ProductFilters): string {
  const queryParts: string[] = [];

  // Gender filter via tags: gender_men, gender_women, gender_unisex
  if (filters.genders && filters.genders.length > 0) {
    const genderTags = filters.genders.map(g => `tag:gender_${g}`).join(' OR ');
    queryParts.push(`(${genderTags})`);
  }

  // Vendor (brand) - native Shopify field, server-side supported
  if (filters.vendor) {
    queryParts.push(`vendor:"${filters.vendor}"`);
  }

  // Fragrance type via tags: type_EDP, type_EDT, type_Parfum
  if (filters.fragranceTypes && filters.fragranceTypes.length > 0) {
    const typeTags = filters.fragranceTypes.map(t => `tag:type_${t}`).join(' OR ');
    queryParts.push(`(${typeTags})`);
  }

  // Signature collection via tag: signature_true
  if (filters.isSignature) {
    queryParts.push(`tag:signature_true`);
  }

  // Season via tags: season_summer, season_spring, etc.
  if (filters.season) {
    queryParts.push(`tag:season_${filters.season}`);
  }

  // Direct tag query
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach(tag => queryParts.push(`tag:${tag}`));
  }

  // Price range - server-side supported
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const min = filters.minPrice ?? 0;
    const max = filters.maxPrice ?? 999999;
    queryParts.push(`variants.price:>=${min} variants.price:<=${max}`);
  }

  return queryParts.join(' AND ');
}

// Fetch products with filters
export async function fetchShopifyProducts(
  first: number = 50, 
  filters?: ProductFilters
): Promise<ShopifyProduct[]> {
  try {
    const variables: Record<string, unknown> = { first };

    if (filters) {
      const query = buildQueryString(filters);
      if (query) {
        variables.query = query;
      }

      if (filters.sortKey) {
        variables.sortKey = filters.sortKey;
        variables.reverse = filters.reverse ?? false;
      }
    }

    const data = await storefrontApiRequest(STOREFRONT_QUERY, variables);
    if (!data) return [];
    return data.data.products.edges;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Fetch all products (simple query without filters)
export async function fetchAllProducts(first: number = 50, query?: string): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query });
    if (!data) return [];
    return data.data.products.edges;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Fetch bestsellers
export async function fetchBestsellers(first: number = 8): Promise<ShopifyProduct[]> {
  return fetchShopifyProducts(first, { sortKey: 'BEST_SELLING' });
}

// Fetch new arrivals
export async function fetchNewArrivals(first: number = 8): Promise<ShopifyProduct[]> {
  return fetchShopifyProducts(first, { sortKey: 'CREATED_AT', reverse: true });
}

// Fetch signature collection
export async function fetchSignatureCollection(first: number = 8): Promise<ShopifyProduct[]> {
  return fetchShopifyProducts(first, { isSignature: true });
}

// Fetch seasonal collection
export async function fetchSeasonalCollection(season: string, first: number = 8): Promise<ShopifyProduct[]> {
  return fetchShopifyProducts(first, { season });
}

// Fetch products by gender (uses tag: gender_*)
export async function fetchProductsByGender(gender: string, first: number = 50): Promise<ShopifyProduct[]> {
  return fetchShopifyProducts(first, { genders: [gender] });
}

// Fetch products by vendor (brand)
export async function fetchProductsByVendor(vendor: string, first: number = 50): Promise<ShopifyProduct[]> {
  return fetchShopifyProducts(first, { vendor });
}

// Fetch unique vendors (brands)
export async function fetchVendors(): Promise<string[]> {
  try {
    const data = await storefrontApiRequest(VENDORS_QUERY, { first: 250 });
    if (!data) return [];
    
    const vendors = data.data.products.edges.map((p: { node: { vendor: string } }) => p.node.vendor);
    return [...new Set(vendors)] as string[];
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
}

// Fetch single product by handle
export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    if (!data) return null;
    return data.data.productByHandle;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Create checkout with cart items
export async function createStorefrontCheckout(items: Array<{ variantId: string; quantity: number }>): Promise<string> {
  try {
    const lines = items.map(item => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    const cartData = await storefrontApiRequest(CART_CREATE_MUTATION, {
      input: { lines },
    });

    if (!cartData) {
      throw new Error('Failed to create cart');
    }

    if (cartData.data.cartCreate.userErrors.length > 0) {
      throw new Error(`Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e: { message: string }) => e.message).join(', ')}`);
    }

    const cart = cartData.data.cartCreate.cart;
    
    if (!cart.checkoutUrl) {
      throw new Error('No checkout URL returned from Shopify');
    }

    const url = new URL(cart.checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch (error) {
    console.error('Error creating storefront checkout:', error);
    throw error;
  }
}

// Helper to extract metafield value
export function getMetafieldValue<T>(metafield: { value: string } | null, defaultValue?: T): T | undefined {
  if (!metafield) return defaultValue;
  try {
    // Check if it's a JSON value (for booleans)
    if (metafield.value === 'true') return true as T;
    if (metafield.value === 'false') return false as T;
    return metafield.value as T;
  } catch {
    return metafield.value as T;
  }
}

// Get available sizes from product variants
export function getProductSizes(product: ShopifyProduct['node']): string[] {
  const sizeOption = product.options.find(opt => opt.name.toLowerCase() === 'size');
  return sizeOption?.values || [];
}

// Format price for display
export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}
