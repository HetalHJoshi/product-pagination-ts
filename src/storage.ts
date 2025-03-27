import { Product } from "./types";

export function loadProducts(): Product[] {
  const stored = localStorage.getItem("products");
  return stored ? JSON.parse(stored) : [];
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem("products", JSON.stringify(products));
}
