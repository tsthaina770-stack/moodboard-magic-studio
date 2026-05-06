import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Menu, X, Phone, LogIn, ChevronDown, Building2, CreditCard, Calculator,
  Shield, Zap, Phone as PhoneIcon, LayoutDashboard, User as UserIcon,
  LogOut, Sparkles,
} from "lucide-react";
import { VinsalesLogo } from "./VinsalesLogo";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/comparateur", label: "Comparateur" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "À propos" },
] as const;

const servicesMenu = [
  { to: "/comparateur", label: "Domiciliation", desc: "Adresse légale prestigieuse",   icon: Building2,  color: "#2F6BFF" },
  { to: "/comparateur", label: "Banque pro",    desc: "Compte adapté à votre activité", icon: CreditCard, color: "#0B2A4A" },
  { to: "/comparateur", label: "Comptabilité",  desc: "Expert-comptable en ligne",      icon: Calculator, color: "#18C29C" },
  { to: "/comparateur", label: "Assurance",     desc: "RC Pro, mutuelle, prévoyance",   icon: Shield,     color: "#2F6BFF" },
  { to: "/comparateur", label: "Énergie",       desc: "Électricité & gaz pro",          icon: Zap,        color: "#18C29C" },
  { to: "/comparateur", label: "Télécoms",      desc: "Internet & téléphonie pro",      icon: PhoneIcon,  color: "#0B2A4A" },
] as const;

interface Props {
  /** When true, header starts transparent over a dark hero and turns solid on scroll. */
  transparentOnTop?: boolean;
}

export function SiteHeader({ transparentOnTop = false }: Props) {
  const [scrolled, setScrolled] = useState(!transparentOnTop);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (transparentOnTop) setScrolled(y > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  // Close on navigation
  useEffect(() => {
    setOpen(false); setServicesOpen(false); setUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside closes dropdowns
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isLight = transparentOnTop && !scrolled;
  const initial = (user?.email?.[0] ?? "?").toUpperCase();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: isLight ? "transparent" : "rgba(255,255,255,0.92)",
        backdropFilter: isLight ? "none" : "saturate(180%) blur(16px)",
        WebkitBackdropFilter: isLight ? "none" : "saturate(180%) blur(16px)",
        boxShadow: isLight ? "none" : "0 1px 0 var(--color-hairline), 0 8px 32px rgba(11,42,74,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18 py-3.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
              <VinsalesLogo size={36} light={isLight} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-xl transition-colors"
                style={{ color: isLight ? "#fff" : "#0B2A4A", letterSpacing: "-0.5px" }}>
                Vinsales
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase mt-0.5"
                style={{ color: isLight ? "rgba(255,255,255,0.5)" : "#8A94A6" }}>
                Les bons choix
              </span>
            </div>
          </Link>

          {/* Center nav (pill) */}
          <nav
            className="hidden lg:flex items-center gap-0.5 p-1 rounded-full transition-colors"
            style={{
              backgroundColor: isLight ? "rgba(255,255,255,0.08)" : "var(--color-brand-soft)",
              border: isLight ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
            }}
          >
            {/* Services dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/40"
                style={{ color: isLight ? "rgba(255,255,255,0.85)" : "#0B2A4A" }}
              >
                Services
                <ChevronDown size={14} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-[520px] bg-white rounded-2xl p-3 grid grid-cols-2 gap-1 animate-scale-in origin-top-left"
                  style={{ border: "1px solid var(--color-hairline)", boxShadow: "0 24px 64px rgba(11,42,74,0.18)" }}
                >
                  {servicesMenu.map((s) => (
                    <Link key={s.label} to={s.to}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-soft transition-colors group">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${s.color}1a` }}>
                        <s.icon size={17} style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-primary leading-tight">{s.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-1 p-3 rounded-xl flex items-center justify-between"
                    style={{ background: "linear-gradient(120deg,#EFF4FF,#E6F9F5)" }}>
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} style={{ color: "#18C29C" }} />
                      <span className="text-sm font-semibold text-primary">Recommandations sur-mesure en 2 min</span>
                    </div>
                    <Link to="/comparateur" className="text-xs font-bold text-white px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: "#2F6BFF" }}>
                      Lancer →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}
                  className="relative px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:bg-white/40"
                  style={{
                    color: active
                      ? (isLight ? "#fff" : "#0B2A4A")
                      : (isLight ? "rgba(255,255,255,0.7)" : "#5A6577"),
                    backgroundColor: active ? (isLight ? "rgba(255,255,255,0.18)" : "#fff") : "transparent",
                    boxShadow: active && !isLight ? "0 2px 8px rgba(11,42,74,0.08)" : "none",
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <a href="tel:+33100000000"
              className="hidden xl:flex items-center gap-1.5 text-sm font-medium px-2.5 py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: isLight ? "#fff" : "#0B2A4A" }}>
              <Phone size={14} style={{ color: isLight ? "#7EAEFF" : "#2F6BFF" }} />
              01 00 00 00 00
            </a>

            {user ? (
              <div ref={userMenuRef} className="relative">
                <button onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pr-3 pl-1 py-1 rounded-full transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: isLight ? "rgba(255,255,255,0.12)" : "var(--color-brand-soft)",
                    border: `1px solid ${isLight ? "rgba(255,255,255,0.2)" : "var(--color-hairline)"}`,
                  }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "linear-gradient(135deg,#2F6BFF,#18C29C)" }}>
                    {initial}
                  </div>
                  <span className="text-sm font-medium" style={{ color: isLight ? "#fff" : "#0B2A4A" }}>
                    Mon espace
                  </span>
                  <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    style={{ color: isLight ? "rgba(255,255,255,0.7)" : "#8A94A6" }} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl py-2 animate-scale-in origin-top-right"
                    style={{ border: "1px solid var(--color-hairline)", boxShadow: "0 24px 64px rgba(11,42,74,0.18)" }}>
                    <div className="px-4 py-2 border-b" style={{ borderColor: "var(--color-hairline)" }}>
                      <p className="text-xs text-muted-foreground">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-primary truncate">{user.email}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-soft transition-colors text-sm text-primary">
                      <LayoutDashboard size={15} style={{ color: "#2F6BFF" }} /> Tableau de bord
                    </Link>
                    <Link to="/profil" className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-soft transition-colors text-sm text-primary">
                      <UserIcon size={15} style={{ color: "#18C29C" }} /> Mon profil
                    </Link>
                    <button onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-soft transition-colors text-sm text-primary border-t"
                      style={{ borderColor: "var(--color-hairline)" }}>
                      <LogOut size={15} style={{ color: "#FF6B6B" }} /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: isLight ? "#fff" : "#0B2A4A" }}>
                <LogIn size={14} /> Connexion
              </Link>
            )}

            <Link to="/comparateur"
              className="relative overflow-hidden px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg group"
              style={{
                background: "linear-gradient(135deg,#2F6BFF,#1E4FD9)",
                boxShadow: "0 6px 18px rgba(47,107,255,0.35)",
              }}>
              <span className="relative z-10 flex items-center gap-1.5">
                Être rappelé
                <Sparkles size={13} className="transition-transform group-hover:rotate-12" />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)" }} />
            </Link>
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-lg" aria-label="Menu"
            style={{ color: isLight ? "#fff" : "#0B2A4A" }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-150"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg,#2F6BFF,#18C29C)", opacity: progress > 1 ? 1 : 0 }} />

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t animate-slide-down" style={{ borderColor: "var(--color-hairline)" }}>
          <div className="px-6 py-4 space-y-1 max-h-[calc(100vh-72px)] overflow-y-auto">
            {user && (
              <div className="flex items-center gap-3 p-3 mb-2 rounded-xl" style={{ backgroundColor: "var(--color-brand-soft)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#2F6BFF,#18C29C)" }}>{initial}</div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Connecté</p>
                  <p className="text-sm font-semibold text-primary truncate">{user.email}</p>
                </div>
              </div>
            )}
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-brand-soft transition-colors">
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t space-y-2" style={{ borderColor: "var(--color-hairline)" }}>
              {user ? (
                <>
                  <Link to="/dashboard" className="block w-full text-center py-3 rounded-xl text-sm font-semibold border"
                    style={{ borderColor: "var(--color-hairline)", color: "#0B2A4A" }}>Tableau de bord</Link>
                  <button onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                    className="block w-full text-center py-3 rounded-xl text-sm font-semibold"
                    style={{ color: "#FF6B6B" }}>Déconnexion</button>
                </>
              ) : (
                <Link to="/auth" className="block w-full text-center py-3 rounded-xl text-sm font-semibold border"
                  style={{ borderColor: "var(--color-hairline)", color: "#0B2A4A" }}>Connexion</Link>
              )}
              <Link to="/comparateur" className="block w-full text-center py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#2F6BFF,#1E4FD9)" }}>
                Être rappelé gratuitement
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
