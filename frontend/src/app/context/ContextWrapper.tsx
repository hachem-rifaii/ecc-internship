import { CategoryProvider } from "./CategoryWrapper";
import { ProductProvider } from "./ProductContext";

import { ReactNode } from "react";

interface ContextWrapperProps {
  children: ReactNode;
}

export const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  return (
    <CategoryProvider>
      <ProductProvider>{children}</ProductProvider>
    </CategoryProvider>
  );
};
