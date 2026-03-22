import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Bell,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

const studentNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: TrendingUp, label: "Predictions", id: "predictions" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const adminNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Students", id: "students" },
  { icon: TrendingUp, label: "Predictions", id: "predictions" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  isAdmin: boolean;
}

export default function AppLayout({ children, isAdmin }: AppLayoutProps) {
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = isAdmin ? adminNav : studentNav;
  const principal = identity?.getPrincipal().toString();
  const displayName =
    profile?.name || (principal ? `${principal.slice(0, 6)}...` : "User");
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-3 px-6 py-6 border-b"
        style={{ borderColor: "oklch(var(--sidebar-border))" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "oklch(var(--primary))" }}
        >
          <GraduationCap className="w-5 h-5" style={{ color: "white" }} />
        </div>
        <div>
          <p
            className="font-bold text-sm"
            style={{ color: "oklch(var(--sidebar-accent-foreground))" }}
          >
            AcadPredict
          </p>
          <p className="text-xs" style={{ color: "oklch(0.60 0.02 264)" }}>
            {isAdmin ? "Admin Panel" : "Student Portal"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => {
                setActiveNav(item.id);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: isActive
                  ? "oklch(var(--primary) / 0.15)"
                  : "transparent",
                color: isActive
                  ? "oklch(var(--primary))"
                  : "oklch(var(--sidebar-foreground))",
              }}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "oklch(var(--primary))" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: "oklch(var(--sidebar-border))" }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className="text-xs font-semibold"
              style={{
                background: "oklch(var(--primary) / 0.15)",
                color: "oklch(var(--primary))",
              }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "oklch(var(--sidebar-accent-foreground))" }}
            >
              {displayName}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "oklch(0.55 0.02 264)" }}
            >
              {isAdmin ? "Administrator" : "Student"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => clear()}
            data-ocid="nav.logout.button"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "oklch(0.55 0.02 264)" }}
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside
        className="hidden lg:flex lg:w-60 xl:w-64 shrink-0 flex-col fixed inset-y-0 left-0 z-30"
        style={{ background: "oklch(var(--sidebar))" }}
      >
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden"
              style={{ background: "oklch(var(--sidebar))" }}
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <button
                type="button"
                className="absolute top-4 right-4"
                onClick={() => setSidebarOpen(false)}
                style={{ color: "oklch(var(--sidebar-foreground))" }}
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col lg:ml-60 xl:ml-64">
        <header className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 bg-card border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 bg-muted/50 border-transparent focus:border-input text-sm"
              data-ocid="header.search_input"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-ocid="header.notifications.button"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted/50 transition-colors"
                  data-ocid="header.user.dropdown_menu"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">
                    {displayName}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => clear()}
                  data-ocid="header.signout.button"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>

        <footer className="px-6 py-4 text-center text-xs text-muted-foreground border-t border-border">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
