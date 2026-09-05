import { IconGrid } from "@/components/icon-grid";
import { usePortfolioData } from "@/context/use-portfolio-data";
export default function Skills() {
  const { skills } = usePortfolioData();
  return <IconGrid title="SKILLS" items={skills} labelKey="title" />;
}
