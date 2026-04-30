import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Check, ArrowRight, Phone, ChevronDown, Star, Award, MapPin, Clock,
  TrendingUp, Users, Zap, MessageCircle, ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CallbackForm } from "@/components/CallbackForm";
import { services, partners, testimonials, faqs } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vinsales — Les bons choix pour bien démarrer" },
      { name: "description", content: "Comparez gratuitement domiciliation, banque pro, comptabilité et assurance pour votre entreprise. Conseil humain et personnalisé sous 24h." },
      { property: "og:title", content: "Vinsales — Comparateur de services pour entrepreneurs" },
      { property: "og:description", content: "Domiciliation, banque pro, comptabilité, assurance — comparez et choisissez les bons partenaires." },
    ],
  }),
  component: HomePage,
});

const filters = ["Tous", "Banque pro", "Domiciliation", "Comptabilité", "Assurance"] as const;

function HomePage() {
  const [activeService, setActiveService] = useState(0);
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>("Tous");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const servicesRef = useRef<HTMLElement>(null);
  const partnersRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Reveal-on-scroll using IntersectionObserver
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const filteredPartners =
    activeFilter === "Tous" ? partners : partners.filter((p) => p.category === activeFilter);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) =>
    ref.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      <SiteHeader transparentOnTop />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute animate-blob"
            style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(47,107,255,0.18), transparent 65%)", top: -100, right: -100, borderRadius: "50%" }}
          />
          <div
            className="absolute animate-blob"
            style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(24,194,156,0.10), transparent 65%)", bottom: 0, left: -50, borderRadius: "50%", animationDelay: "2s" }}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{ backgroundColor: "rgba(24,194,156,0.18)", color: "#4FDFC0", border: "1px solid rgba(24,194,156,0.3)" }}
            >
              <Check size={12} />
              Service 100% gratuit pour les entrepreneurs
            </div>
            <h1 className="font-display font-bold leading-tight mb-6 text-white" style={{ fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-1.5px" }}>
              Les bons choix pour<br />
              <span style={{ color: "#18C29C" }}>bien démarrer</span> votre<br />
              entreprise.
            </h1>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480 }}>
              Domiciliation, banque pro, comptabilité, assurance — comparez les meilleures offres et démarrez avec les bons partenaires.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/comparateur"
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                style={{ backgroundColor: "#2F6BFF", boxShadow: "var(--shadow-cta)", fontSize: 15 }}
              >
                Comparer les offres <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => scrollTo(contactRef)}
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold transition-all hover:bg-white/15"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)", fontSize: 15 }}
              >
                <Phone size={15} />
                Être rappelé gratuitement
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              {["1 200+ entrepreneurs accompagnés", "8 catégories de services", "Conseillers 7j/7"].map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                  <Check size={13} style={{ color: "#18C29C", flexShrink: 0 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4 animate-fade-up delay-200">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <p className="font-display font-semibold text-sm text-primary">Comparez en 3 étapes</p>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#E6F9F5", color: "#18C29C" }}>
                  Gratuit
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { step: "1", label: "Votre profil", desc: "Statut juridique, secteur, besoins", done: true },
                  { step: "2", label: "Vos offres", desc: "Résultats personnalisés en 2 min", done: true },
                  { step: "3", label: "Votre conseiller", desc: "Rappel gratuit sous 24h", done: false },
                ].map(({ step, label, desc, done }) => (
                  <div key={step} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors"
                      style={{ backgroundColor: done ? "#2F6BFF" : "#F5F7FA", color: done ? "white" : "#8A94A6", border: done ? "none" : "2px solid #E8ECF0" }}
                    >
                      {done ? <Check size={13} /> : step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/comparateur"
                className="w-full mt-6 py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2F6BFF" }}
              >
                Démarrer le comparateur <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "1 200+", label: "Entrepreneurs" },
                { value: "4.9/5", label: "Note moyenne" },
                { value: "< 24h", label: "Délai de rappel" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white rounded-xl p-4 text-center shadow-lg">
                  <p className="font-display font-bold text-lg" style={{ color: "#2F6BFF" }}>{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollTo(servicesRef)}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.5)" }}
          aria-label="Découvrir les services"
        >
          <span className="text-xs">Découvrir</span>
          <ChevronDown size={18} className="animate-bounce" />
        </button>
      </section>

      {/* SERVICES */}
      <section ref={servicesRef} className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Nos services</p>
            <h2 className="font-display font-bold mb-4 text-primary" style={{ fontSize: 36, letterSpacing: "-0.8px" }}>
              Tout ce dont vous avez besoin,<br />comparé pour vous
            </h2>
            <p className="text-lg mx-auto text-muted-foreground" style={{ maxWidth: 520 }}>
              8 catégories de services essentiels pour créer et développer votre entreprise.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-14">
            {services.map((svc, i) => {
              const Icon = svc.icon;
              const active = activeService === i;
              return (
                <button
                  key={svc.label}
                  onClick={() => setActiveService(i)}
                  data-reveal
                  className="text-left p-6 rounded-2xl transition-all duration-300 focus:outline-none"
                  style={{
                    backgroundColor: active ? "#0B2A4A" : "white",
                    border: `2px solid ${active ? "#0B2A4A" : "var(--color-hairline)"}`,
                    boxShadow: active ? "var(--shadow-elev)" : "var(--shadow-soft)",
                    transform: active ? "translateY(-4px)" : "none",
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ backgroundColor: active ? "rgba(255,255,255,0.1)" : svc.bg }}
                  >
                    <Icon size={22} style={{ color: active ? "white" : svc.color }} />
                  </div>
                  <h3 className="font-display font-bold text-base mb-1.5" style={{ color: active ? "white" : "#0B2A4A" }}>
                    {svc.label}
                  </h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: active ? "rgba(255,255,255,0.65)" : "#8A94A6" }}>
                    {svc.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: active ? "#18C29C" : "#2F6BFF" }}>{svc.count}</span>
                    <span className="text-xs font-medium" style={{ color: active ? "rgba(255,255,255,0.5)" : "#8A94A6" }}>dès {svc.from}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-hairline animate-scale-in" key={activeService}>
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-8 border-r border-hairline">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: services[activeService].bg }}>
                    {(() => {
                      const Icon = services[activeService].icon;
                      return <Icon size={26} style={{ color: services[activeService].color }} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-primary">{services[activeService].label}</h3>
                    <p className="text-sm text-muted-foreground">{services[activeService].count} vérifiées et comparées</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: TrendingUp, label: "Économies moyennes", value: "jusqu'à 40%" },
                    { icon: Clock, label: "Délai de réponse", value: "< 24 heures" },
                    { icon: Users, label: "Entrepreneurs satisfaits", value: "1 200+" },
                    { icon: Award, label: "Partenaires vérifiés", value: "80+ actifs" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-background">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EFF4FF" }}>
                        <Icon size={15} style={{ color: "#2F6BFF" }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-display font-bold text-sm text-primary">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-between" style={{ backgroundColor: "var(--color-surface-alt)" }}>
                <div>
                  <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Ce que vous gagnez</p>
                  <div className="space-y-3">
                    {["Comparaison objective sans pub", "Conseiller dédié sans frais", "Offres négociées en exclusivité", "Suivi post-souscription inclus"].map((t) => (
                      <div key={t} className="flex items-start gap-2.5 text-sm text-primary">
                        <Check size={14} style={{ color: "#18C29C", marginTop: 2, flexShrink: 0 }} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => scrollTo(partnersRef)}
                  className="mt-8 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#2F6BFF" }}
                >
                  Voir les offres <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="py-20" style={{ backgroundColor: "#0B2A4A" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#7EAEFF", letterSpacing: 2 }}>Comment ça marche</p>
            <h2 className="font-display font-bold text-white" style={{ fontSize: 36, letterSpacing: "-0.8px" }}>
              Simple, rapide, sans engagement
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { icon: Zap, step: "01", title: "Renseignez votre profil", desc: "2 minutes pour nous décrire votre projet et vos besoins." },
              { icon: TrendingUp, step: "02", title: "Recevez vos offres", desc: "Notre algorithme sélectionne les meilleures options pour vous." },
              { icon: MessageCircle, step: "03", title: "Échangez avec un expert", desc: "Un conseiller Vinsales vous rappelle gratuitement sous 24h." },
              { icon: Check, step: "04", title: "Activez votre service", desc: "Choisissez et souscrivez en toute confiance, sans surprises." },
            ].map(({ icon: Icon, step, title, desc }, i) => (
              <div key={step} className="relative flex flex-col items-start gap-4" data-reveal style={{ animationDelay: `${i * 80}ms` }}>
                {i < 3 && (
                  <div
                    className="hidden md:block absolute top-7 z-0"
                    style={{
                      height: 2,
                      background: "linear-gradient(to right, rgba(47,107,255,0.4), transparent)",
                      width: "calc(100% - 24px)",
                      left: 60,
                    }}
                  />
                )}
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(47,107,255,0.2)", border: "1px solid rgba(47,107,255,0.3)" }}
                >
                  <Icon size={22} style={{ color: "#7EAEFF" }} />
                </div>
                <div>
                  <span className="text-xs font-bold" style={{ color: "rgba(126,174,255,0.6)" }}>{step}</span>
                  <h3 className="font-display font-semibold text-white mt-1 mb-2 text-base">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section ref={partnersRef} className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12" data-reveal>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Nos partenaires</p>
              <h2 className="font-display font-bold text-primary" style={{ fontSize: 36, letterSpacing: "-0.8px" }}>
                Des offres vérifiées et<br />négociées pour vous
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: activeFilter === f ? "#0B2A4A" : "white",
                    color: activeFilter === f ? "white" : "#8A94A6",
                    border: `1.5px solid ${activeFilter === f ? "#0B2A4A" : "var(--color-hairline)"}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((p, i) => (
              <div
                key={p.name}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer animate-fade-up"
                style={{
                  border: `2px solid ${p.recommended ? "#2F6BFF" : "var(--color-hairline)"}`,
                  boxShadow: p.recommended ? "var(--shadow-card)" : "var(--shadow-soft)",
                  animationDelay: `${i * 70}ms`,
                }}
              >
                {p.recommended && (
                  <div className="px-5 py-2 flex items-center gap-2 text-xs font-semibold text-white" style={{ backgroundColor: "#2F6BFF" }}>
                    <Award size={12} /> Recommandé par Vinsales
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.initial}
                      </div>
                      <div>
                        <p className="font-display font-bold text-base text-primary">{p.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={10} /> {p.location}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full text-muted-foreground bg-background border border-hairline">
                      {p.category}
                    </span>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed text-foreground/70">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium text-primary bg-background border border-hairline">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(5)].map((_, i2) => (
                      <Star key={i2} size={13} fill={i2 < Math.floor(p.rating) ? "#F59E0B" : "none"} style={{ color: "#F59E0B" }} />
                    ))}
                    <span className="text-xs font-semibold ml-1 text-primary">{p.rating}</span>
                    <span className="text-xs text-muted-foreground">({p.reviews.toLocaleString("fr-FR")} avis)</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-hairline">
                    <div>
                      <p className="text-xs text-muted-foreground">À partir de</p>
                      <p className="font-display font-bold text-lg text-primary">{p.price}</p>
                    </div>
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#2F6BFF" }}
                    >
                      Choisir <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/partenaires"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-md text-primary border-2 border-primary bg-transparent"
            >
              Voir tous nos partenaires <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14" data-reveal>
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Témoignages</p>
            <h2 className="font-display font-bold mb-4 text-primary" style={{ fontSize: 36, letterSpacing: "-0.8px" }}>
              Ils ont choisi Vinsales
            </h2>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" style={{ color: "#F59E0B" }} />
              ))}
              <span className="font-bold ml-1 text-primary">4.9/5</span>
              <span className="text-muted-foreground">· 1 200+ entrepreneurs</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating, avatar, color }, i) => (
              <div
                key={name}
                className="rounded-2xl p-7 transition-all hover:shadow-lg border border-hairline animate-fade-up"
                style={{ backgroundColor: "var(--color-surface-alt)", animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(rating)].map((_, j) => (
                    <Star key={j} size={14} fill="#F59E0B" style={{ color: "#F59E0B" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 text-foreground/70">"{text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-hairline">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-primary">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#2F6BFF", letterSpacing: 2 }}>FAQ</p>
              <h2 className="font-display font-bold mb-5 text-primary" style={{ fontSize: 32, letterSpacing: "-0.6px" }}>
                Questions fréquentes
              </h2>
              <p className="text-base mb-8 leading-relaxed text-muted-foreground">
                Une question sans réponse ? Nos conseillers sont disponibles du lundi au samedi de 9h à 19h.
              </p>
              <div className="flex flex-col gap-3">
                <a href="tel:+33100000000" className="flex items-center gap-3 p-4 bg-white rounded-xl transition-shadow hover:shadow-md border border-hairline">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#EFF4FF" }}>
                    <Phone size={17} style={{ color: "#2F6BFF" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">01 00 00 00 00</p>
                    <p className="text-xs text-muted-foreground">Lun–Sam · 9h–19h</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-3">
              {faqs.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden transition-all"
                  style={{ border: `1.5px solid ${openFaq === i ? "#2F6BFF" : "var(--color-hairline)"}` }}
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-display font-semibold text-sm pr-4 text-primary">{q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        color: "#2F6BFF",
                        flexShrink: 0,
                        transform: openFaq === i ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? 240 : 0 }}
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-foreground/70 border-t border-hairline pt-4">{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALLBACK */}
      <section ref={contactRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-reveal>
              <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Être rappelé</p>
              <h2 className="font-display font-bold mb-5 text-primary" style={{ fontSize: 36, letterSpacing: "-0.8px" }}>
                Un conseiller vous<br />rappelle gratuitement
              </h2>
              <p className="text-base mb-8 leading-relaxed text-muted-foreground" style={{ maxWidth: 440 }}>
                Laissez votre numéro, choisissez votre créneau. Un expert Vinsales vous contacte et vous guide vers les meilleures offres pour votre projet.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Clock, text: "Rappel sous 24h maximum" },
                  { icon: Check, text: "Service 100% gratuit et sans engagement" },
                  { icon: Award, text: "Vos données sont protégées (RGPD)" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-foreground/70">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E6F9F5" }}>
                      <Icon size={15} style={{ color: "#18C29C" }} />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <CallbackForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
