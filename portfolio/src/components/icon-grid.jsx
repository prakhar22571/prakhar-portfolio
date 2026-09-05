import PropTypes from "prop-types";
import { GlassCard } from "@portfolio/shared/components/ui/glass-card";
import { RevealGroup, RevealItem } from "@portfolio/shared/components/reveal";
export function IconGrid({ title, items, labelKey }) {
  return (
    <section className="w-full flex flex-col gap-8 sm:gap-12">
      <h1 className="text-tubeLight-effect text-[2rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[3.8rem] tracking-[15px] dancing_text mx-auto w-fit bg-background">
        {title}
      </h1>
      <RevealGroup className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <RevealItem key={item._id} whileHover={{ y: -4, scale: 1.05 }}>
            <GlassCard className="h-fit p-7 flex flex-col items-center gap-3">
              {item.svg?.url && (
                <img
                  src={item.svg.url}
                  alt={item[labelKey]}
                  loading="lazy"
                  decoding="async"
                  className="h-12 sm:h-24 w-auto"
                />
              )}
              <p className="text-muted-foreground text-center">
                {item[labelKey]}
              </p>
            </GlassCard>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}

IconGrid.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string,
};
