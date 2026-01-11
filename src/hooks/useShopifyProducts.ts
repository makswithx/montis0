import { useQuery } from "@tanstack/react-query";
import { 
  fetchShopifyProducts, 
  fetchProductByHandle, 
  fetchBestsellers,
  fetchNewArrivals,
  fetchSignatureCollection,
  fetchSeasonalCollection,
  fetchProductsByGender,
  fetchProductsByVendor,
  fetchVendors,
  fetchAllProducts,
  ShopifyProduct,
  ProductFilters
} from "@/lib/shopify";

// Fetch products with filters
export function useShopifyProducts(count: number = 50, filters?: ProductFilters) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-products", count, filters],
    queryFn: () => fetchShopifyProducts(count, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch all products (simple query)
export function useAllProducts(count: number = 50, query?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-all-products", count, query],
    queryFn: () => fetchAllProducts(count, query),
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch single product by handle
export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 1000 * 60 * 5,
    enabled: !!handle,
  });
}

// Fetch bestsellers
export function useBestsellers(count: number = 8) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-bestsellers", count],
    queryFn: () => fetchBestsellers(count),
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch new arrivals
export function useNewArrivals(count: number = 8) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-new-arrivals", count],
    queryFn: () => fetchNewArrivals(count),
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch signature collection
export function useSignatureCollection(count: number = 8) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-signature", count],
    queryFn: () => fetchSignatureCollection(count),
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch seasonal collection
export function useSeasonalCollection(season: string, count: number = 8) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-seasonal", season, count],
    queryFn: () => fetchSeasonalCollection(season, count),
    staleTime: 1000 * 60 * 5,
    enabled: !!season,
  });
}

// Fetch products by gender (uses tag: gender_*)
export function useProductsByGender(gender: string, count: number = 50) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-gender", gender, count],
    queryFn: () => fetchProductsByGender(gender, count),
    staleTime: 1000 * 60 * 5,
    enabled: !!gender,
  });
}

// Fetch products by vendor (brand)
export function useProductsByVendor(vendor: string, count: number = 50) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-vendor", vendor, count],
    queryFn: () => fetchProductsByVendor(vendor, count),
    staleTime: 1000 * 60 * 5,
    enabled: !!vendor,
  });
}

// Fetch all vendors (brands)
export function useVendors() {
  return useQuery<string[]>({
    queryKey: ["shopify-vendors"],
    queryFn: fetchVendors,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
