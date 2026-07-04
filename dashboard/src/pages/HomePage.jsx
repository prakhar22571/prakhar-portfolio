import { Link, useNavigate } from "react-router-dom";
import {
  FolderGit,
  History,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareMore,
  Package2,
  PanelLeft,
  PencilRuler,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Dashboard from "./sub-components/Dashboard";
import AddSkill from "./sub-components/AddSkill";
import AddProject from "./sub-components/AddProject";
import AddSoftwareApplications from "./sub-components/AddSoftwareApplications";
import Account from "./sub-components/Account";
import { useDispatch, useSelector } from "react-redux";
import { logout, clearAllUserErrors } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import Messages from "./sub-components/Messages";
import AddTimeline from "./sub-components/AddTimeline";
import { ModeToggle } from "@/components/mode-toggle";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const NAV_ITEMS = [
  { key: "Dashboard", label: "Dashboard", icon: Home },
  { key: "Add Project", label: "Add Project", icon: FolderGit },
  { key: "Add Skill", label: "Add Skill", icon: PencilRuler },
  { key: "Add Uses", label: "Add Uses", icon: LayoutGrid },
  { key: "Add Timeline", label: "Add Timeline", icon: History },
  { key: "Messages", label: "Messages", icon: MessageSquareMore },
  { key: "Account", label: "Account", icon: User },
];

const SidebarNavItem = ({ item, active, setActive }) => {
  const isActive = active === item.key;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg ${
              isActive ? "text-accent-foreground" : "text-muted-foreground"
            } transition-colors hover:text-foreground md:h-8 md:w-8`}
            onClick={() => setActive(item.key)}
          >
            {isActive && (
              <m.span
                layoutId="sidebar-active-pill"
                className="glass absolute inset-0 rounded-lg shadow-glow-sm"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <item.icon className="relative z-10 h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const HomePage = () => {
  const [active, setActive] = useState("");
  const { isAuthenticated, authChecked, error, user } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const prefersReducedMotion = usePrefersReducedMotion();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out!");
  };
  const navigateTo = useNavigate();
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (authChecked && !isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, authChecked]);

  const renderActiveSection = () => {
    switch (active) {
      case "Dashboard":
        return <Dashboard />;
      case "Add Project":
        return <AddProject />;
      case "Add Skill":
        return <AddSkill />;
      case "Add Uses":
        return <AddSoftwareApplications />;
      case "Add Timeline":
        return <AddTimeline />;
      case "Messages":
        return <Messages />;
      case "Account":
        return <Account />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-muted/40">
      <div
        aria-hidden="true"
        className="bg-aurora animate-float pointer-events-none fixed inset-0 -z-10 opacity-60"
      />
      <aside className="glass fixed inset-y-0 left-0 hidden w-14 flex-col border-r sm:flex z-50">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
            <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.key} item={item} active={active} setActive={setActive} />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <header className="glass sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:backdrop-blur-none sm:px-6 max-[900px]:h-[100px]">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                className={`group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base`}
              >
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Dashboard")}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Project"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Add Project")}
              >
                <FolderGit className="h-5 w-5" />
                Add Project
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Skill"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Add Skill")}
              >
                <PencilRuler className="h-5 w-5" />
                Add Skill
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Uses"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Add Uses")}
              >
                <LayoutGrid className="h-5 w-5" />
                Add Uses
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Profile"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Account")}
              >
                <User className="h-5 w-5" />
                Account
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Timeline"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Timeline")}
              >
                <History className="h-5 w-5" />
                Timeline
              </Link>
              <Link
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Messages"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground "
                }`}
                onClick={() => setActive("Messages")}
              >
                <MessageSquareMore className="h-5 w-5" />
                Messages
              </Link>
              <Link
                className={
                  "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                }
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4 md:grow-0 sm:ml-16 sm:mt-5">
          <img
            src={user && user.avatar && user.avatar.url}
            alt="avatar"
            loading="lazy"
            decoding="async"
            className="w-20 h-20 rounded-full max-[900px]:hidden shadow-glow-sm"
          />
          <h1 className="text-4xl max-[900px]:text-2xl">
            Welcome back, {user.fullName}
          </h1>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </header>
      <AnimatePresence mode="wait">
        <m.div
          key={active || "Dashboard"}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {renderActiveSection()}
        </m.div>
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
