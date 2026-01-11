import { useQuery } from "@tanstack/react-query";
import { fetchShopifyProducts, fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";

export function useShopifyProducts(count: number = 50, query?: string) {
  return useQuery<ShopifyProduct[]>({
    queryKey: ["shopify-products", count, query],
    queryFn: () => fetchShopifyProducts(count, query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!handle,
  });
}
