import React, { createContext, useContext, useState } from "react";

import { getCategories } from "@/api/services/categoryService";

interface CategoryWrapperProps {
  children: React.ReactNode;
}

interface CategoryContextType {
  categories: any[] | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const useCategoryContext = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};

export const CategoryProvider: React.FC<CategoryWrapperProps> = ({
  children,
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to fetch categories" + err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CategoryContext.Provider
      value={{ categories, loading, error, fetchCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
