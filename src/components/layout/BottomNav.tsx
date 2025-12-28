import { Link, useLocation } from "react-router-dom";
import { Home, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/submit", icon: Route, label: "Submit Route" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-primary safe-bottom z-50">
      <div className="flex items-center justify-center gap-12 h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center p-2 transition-all duration-200 tap-highlight-none",
                "hover:scale-110 active:scale-95",
                isActive ? "text-primary-foreground" : "text-primary-foreground/70"
              )}
            >
              <item.icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  isActive && "animate-bounce-subtle"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
