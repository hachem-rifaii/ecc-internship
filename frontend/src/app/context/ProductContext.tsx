'use client'
import { createContext, useState, useContext, ReactNode } from "react";
import { getProducts } from "@/api/services/productService"; // Import the API service


interface ProductContextType {
  products: any[] | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError("Failed to fetch products" + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, error, fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};
