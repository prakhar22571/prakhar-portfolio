import PropTypes from "prop-types";
import {
  GlassCard,
  CardContent,
} from "@portfolio/shared/components/ui/glass-card";
export function AuthPage({ title, description, image, children }) {
  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4">
        <GlassCard className="w-full max-w-[420px]">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mt-2 text-muted-foreground">{description}</p>
            </div>
            {children}
          </CardContent>
        </GlassCard>
      </div>
      <div className="hidden lg:flex justify-center items-center">
        <img
          src={image}
          alt=""
          className="rounded-2xl shadow-glass opacity-90"
        />
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  children: PropTypes.node,
};
