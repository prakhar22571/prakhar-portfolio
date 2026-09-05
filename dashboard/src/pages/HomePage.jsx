import { useSearchParams } from "react-router-dom";
import {
  FolderGit,
  History,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareMore,
  PanelLeft,
  PencilRuler,
  User,
} from "lucide-react";
import { Button } from "@portfolio/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { useMutation } from "@/hooks/use-mutation";
import { ModeToggle } from "@portfolio/shared/components/mode-toggle";
import { usePrefersReducedMotion } from "@portfolio/shared/hooks/use-reduced-motion";
import Dashboard from "./sub-components/Dashboard";
import AddSkill from "./sub-components/AddSkill";
import AddProject from "./sub-components/AddProject";
import AddSoftwareApplications from "./sub-components/AddSoftwareApplications";
import Account from "./sub-components/Account";
import Messages from "./sub-components/Messages";
import AddTimeline from "./sub-components/AddTimeline";

const items = [
  { key: "Dashboard", icon: Home, component: Dashboard },
  { key: "Add Project", icon: FolderGit, component: AddProject },
  { key: "Add Skill", icon: PencilRuler, component: AddSkill },
  { key: "Add Uses", icon: LayoutGrid, component: AddSoftwareApplications },
  { key: "Add Timeline", icon: History, component: AddTimeline },
  { key: "Messages", icon: MessageSquareMore, component: Messages },
  { key: "Account", icon: User, component: Account },
];
export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const active =
    items.find((item) => item.key === params.get("section")) || items[0];
  const Section = active.component;
  const [open, setOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.user);
  const reduced = usePrefersReducedMotion();
  const mutate = useMutation();
  function select(key) {
    setParams(key === "Dashboard" ? {} : { section: key });
    setOpen(false);
  }
  const exit = () => mutate(logout(), "Logged out.");
  function navigation(mobile = false) {
    return items.map(({ key, icon: Icon }) => {
      const button = (
        <button
          type="button"
          aria-current={active.key === key ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg p-2 ${active.key === key ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => select(key)}
        >
          <Icon className="h-5 w-5" />
          <span className={mobile ? "" : "sr-only"}>{key}</span>
        </button>
      );
      return mobile ? (
        <div key={key}>{button}</div>
      ) : (
        <Tooltip key={key}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{key}</TooltipContent>
        </Tooltip>
      );
    });
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <TooltipProvider>
        <aside className="glass fixed inset-y-0 left-0 hidden w-14 flex-col border-r sm:flex z-50">
          <nav aria-label="Dashboard sections" className="grid gap-4 px-2 py-5">
            {navigation()}
          </nav>
          <Button
            aria-label="Logout"
            size="icon"
            disabled={loading}
            onClick={exit}
            className="m-auto mb-5"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </aside>
      </TooltipProvider>
      <header className="glass flex items-center gap-4 border-b p-4 sm:ml-14">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="sm:hidden"
              aria-label="Toggle menu"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass">
            <SheetTitle>Portfolio dashboard</SheetTitle>
            <SheetDescription>Choose a section to manage.</SheetDescription>
            <nav
              aria-label="Mobile dashboard sections"
              className="grid gap-3 mt-6"
            >
              {navigation(true)}
              <Button disabled={loading} onClick={exit}>
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        {user.avatar?.url && (
          <img
            src={user.avatar.url}
            alt=""
            className="hidden md:block w-16 h-16 rounded-full"
          />
        )}
        <h1 className="text-xl sm:text-3xl">Welcome back, {user.fullName}</h1>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>
      <AnimatePresence mode="wait">
        <m.div
          key={active.key}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Section />
        </m.div>
      </AnimatePresence>
    </div>
  );
}
