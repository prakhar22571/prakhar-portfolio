import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

/**
 * Full-screen loading / error overlay shown while the portfolio data is being
 * fetched (the backend can take several seconds to wake up).
 */
export function Loader({ error = false, onRetry }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-5">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none absolute inset-0 -z-10 opacity-70"
      />
      <GlassCard className="flex flex-col items-center gap-6 px-10 py-10 text-center">
        {error ? (
          <>
            <p className="text-lg font-semibold text-foreground">
              Couldn&apos;t reach the server
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              The backend may still be waking up. Give it a moment and try again.
            </p>
            {onRetry && (
              <Button onClick={onRetry} className="rounded-[30px] hover:shadow-glow">
                Retry
              </Button>
            )}
          </>
        ) : (
          <>
            <span className="relative flex h-14 w-14" role="status" aria-label="Loading">
              <span className="absolute inset-0 rounded-full border-2 border-glass-border" />
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
            </span>
            <p className="animate-glow-pulse text-sm uppercase tracking-[6px] text-muted-foreground">
              Loading
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}
