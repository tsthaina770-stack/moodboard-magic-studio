import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, ChevronLeft, Star, Award, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CallbackForm } from "@/components/CallbackForm";
import { services, partners } from "@/lib/site-data";

export const Route = createFileRoute("/comparateur")({
  head: () => ({
    meta: [
      { title: "Comparateur Vinsales — Trouvez vos services en 2 minutes" },
      { name: "description", content: "Renseignez votre profil et recevez instantanément les meilleures offres adaptées à votre projet." },
    ],
  }),
  component: ComparateurPage,
});

const statuts = ["Auto-entrepreneur", "SASU", "SARL", "EURL", "SAS", "Autre"] as const;
const budgets = ["< 50€/mois", "50-150€/mois", "150-500€/mois", "> 500€/mois"] as const;

function ComparateurPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [statut, setStatut] = useState<typeof statuts[number] | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budget, setBudget] = useState<typeof budgets[number] | null>(null);

  const toggleService = (slug: string) =>
    setSelectedServices((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  return (
    <div>
      <SiteHeader transparentOnTop />

      <section className="pt-32 pb-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>Comparateur</p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 44, letterSpacing: "-1.2px" }}>
            Trouvez vos services en<br />2 minutes
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            3 questions simples, des recommandations personnalisées par notre algorithme et un conseiller dédié.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    backgroundColor: step >= n ? "#2F6BFF" : "white",
                    color: step >= n ? "white" : "#8A94A6",
                    border: `2px solid ${step >= n ? "#2F6BFF" : "var(--color-hairline)"}`,
                  }}
                >
                  {step > n ? <Check size={16} /> : n}
                </div>
                {n < 3 && <div className="w-12 h-0.5" style={{ backgroundColor: step > n ? "#2F6BFF" : "var(--color-hairline)" }} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-hairline animate-scale-in" key={step}>
            {step === 1 && (
              <>
                <h2 className="font-display font-bold text-2xl mb-2 text-primary">Quel est votre statut juridique ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Pour personnaliser vos offres.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {statuts.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatut(s)}
                      className="px-4 py-4 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: statut === s ? "#0B2A4A" : "white",
                        color: statut === s ? "white" : "#0B2A4A",
                        border: `2px solid ${statut === s ? "#0B2A4A" : "var(--color-hairline)"}`,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    disabled={!statut}
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                    style={{ backgroundColor: "#2F6BFF" }}
                  >
                    Continuer <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-display font-bold text-2xl mb-2 text-primary">Quels services vous intéressent ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Sélectionnez tout ce qui s'applique.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {services.map((svc) => {
                    const Icon = svc.icon;
                    const active = selectedServices.includes(svc.slug);
                    return (
                      <button
                        key={svc.slug}
                        onClick={() => toggleService(svc.slug)}
                        className="p-5 rounded-xl text-left transition-all hover:-translate-y-0.5"
                        style={{
                          backgroundColor: active ? svc.bg : "white",
                          border: `2px solid ${active ? svc.color : "var(--color-hairline)"}`,
                        }}
                      >
                        <Icon size={20} style={{ color: svc.color }} />
                        <p className="font-display font-semibold text-sm mt-2 text-primary">{svc.label}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-primary border border-hairline">
                    <ChevronLeft size={16} /> Retour
                  </button>
                  <button
                    disabled={selectedServices.length === 0}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                    style={{ backgroundColor: "#2F6BFF" }}
                  >
                    Continuer <ArrowRight size={16} />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-display font-bold text-2xl mb-2 text-primary">Quel budget mensuel ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Tous services confondus.</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className="px-4 py-4 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{
                        backgroundColor: budget === b ? "#0B2A4A" : "white",
                        color: budget === b ? "white" : "#0B2A4A",
                        border: `2px solid ${budget === b ? "#0B2A4A" : "var(--color-hairline)"}`,
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-primary border border-hairline">
                    <ChevronLeft size={16} /> Retour
                  </button>
                  <a
                    href="#resultats"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ backgroundColor: budget ? "#18C29C" : "#8A94A6", pointerEvents: budget ? "auto" : "none" }}
                  >
                    Voir mes recommandations <ArrowRight size={16} />
                  </a>
                </div>
              </>
            )}
          </div>

          {budget && step === 3 && (
            <div id="resultats" className="mt-16 animate-fade-up">
              <h2 className="font-display font-bold text-2xl mb-2 text-primary">Vos recommandations</h2>
              <p className="text-sm text-muted-foreground mb-8">Sélectionnées par notre algorithme pour votre profil.</p>
              <div className="space-y-4">
                {partners.slice(0, 3).map((p) => (
                  <div key={p.name} className="bg-white rounded-2xl p-6 border-2 flex items-center gap-6 hover:-translate-y-0.5 transition-all" style={{ borderColor: "#2F6BFF", boxShadow: "var(--shadow-card)" }}>
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0" style={{ backgroundColor: p.color }}>{p.initial}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "#2F6BFF" }}>
                          <Award size={10} className="inline mr-1" />Recommandé
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} />{p.location}</span>
                      </div>
                      <p className="font-display font-bold text-primary">{p.name}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Star size={12} fill="#F59E0B" style={{ color: "#F59E0B" }} />
                        <span className="font-semibold text-primary">{p.rating}</span>
                        <span className="text-muted-foreground">· {p.price}</span>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#2F6BFF" }}>
                      Voir l'offre
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-display font-bold text-xl text-primary mb-3">Besoin d'un conseil personnalisé ?</h3>
                  <p className="text-sm text-muted-foreground">Un expert Vinsales vous rappelle gratuitement sous 24h pour affiner votre choix et négocier les meilleures conditions.</p>
                </div>
                <CallbackForm />
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
