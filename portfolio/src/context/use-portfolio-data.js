import { useContext } from "react";
import { PortfolioDataContext } from "./portfolio-context";
export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context)
    throw new Error(
      "usePortfolioData must be used within a PortfolioDataProvider",
    );
  return context;
}
