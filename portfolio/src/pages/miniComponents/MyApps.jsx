import { IconGrid } from "@/components/icon-grid";
import { usePortfolioData } from "@/context/use-portfolio-data";
export default function MyApps() {
  const { apps } = usePortfolioData();
  return <IconGrid title="MY APPS" items={apps} labelKey="name" />;
}
