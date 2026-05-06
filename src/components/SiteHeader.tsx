import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X, Phone, LogIn, User as UserIcon } from "lucide-react";
import { VinsalesLogo } from "./VinsalesLogo";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/comparateur", label: "Comparateur" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "À propos" },
] as const;

interface Props {
  /** When true, header starts transparent over a dark hero and turns solid on scroll. */
  transparentOnTop?: boolean;
}

export function SiteHeader({ transparentOnTop = false }: Props) {
  const [scrolled, setScrolled] = useState(!transparentOnTop);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!transparentOnTop) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  // Close mobile menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isLight = !scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled ? "0 1px 24px rgba(11,42,74,0.06)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-hairline)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <VinsalesLogo size={34} light={isLight} />
            <span
              className="font-display font-bold text-xl transition-colors"
              style={{ color: isLight ? "#fff" : "#0B2A4A", letterSpacing: "-0.4px" }}
            >
              Vinsales
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: isLight
                      ? active ? "#ffffff" : "rgba(255,255,255,0.75)"
                      : active ? "#0B2A4A" : "#8A94A6",
                    backgroundColor: active
                      ? (isLight ? "rgba(255,255,255,0.12)" : "var(--color-brand-soft)")
                      : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+33100000000"
              className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              style={{ color: isLight ? "#fff" : "#0B2A4A" }}
            >
              <Phone size={15} style={{ color: isLight ? "#7EAEFF" : "#2F6BFF" }} />
              01 00 00 00 00
            </a>
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: isLight ? "#fff" : "#0B2A4A" }}
              >
                <UserIcon size={15} style={{ color: isLight ? "#7EAEFF" : "#2F6BFF" }} />
                Mon espace
              </Link>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: isLight ? "#fff" : "#0B2A4A" }}
              >
                <LogIn size={15} style={{ color: isLight ? "#7EAEFF" : "#2F6BFF" }} />
                Connexion
              </Link>
            )}
            <Link
              to="/comparateur"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "#2F6BFF", boxShadow: "0 6px 18px rgba(47,107,255,0.35)" }}
            >
              Être rappelé
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            style={{ color: isLight ? "#fff" : "#0B2A4A" }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t animate-slide-down" style={{ borderColor: "var(--color-hairline)" }}>
          <div className="px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-brand-soft transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t space-y-2" style={{ borderColor: "var(--color-hairline)" }}>
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "var(--color-hairline)", color: "#0B2A4A" }}
              >
                {user ? "Mon espace" : "Connexion"}
              </Link>
              <Link
                to="/comparateur"
                className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#2F6BFF" }}
              >
                Être rappelé gratuitement
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
