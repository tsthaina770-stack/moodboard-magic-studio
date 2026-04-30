import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MapPin, Award, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { partners } from "@/lib/site-data";

export const Route = createFileRoute("/partenaires")({
  head: () => ({
    meta: [
      { title: "Nos partenaires — Vinsales" },
      { name: "description", content: "Découvrez les 80+ partenaires audités et recommandés par Vinsales : banques, comptables, assureurs, domiciliataires et plus." },
    ],
  }),
  component: PartnersPage,
});

const filters = ["Tous", "Banque pro", "Domiciliation", "Comptabilité", "Assurance"] as const;

function PartnersPage() {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>("Tous");
  const filtered = activeFilter === "Tous" ? partners : partners.filter((p) => p.category === activeFilter);

  return (
    <div>
      <SiteHeader transparentOnTop />

      <section className="pt-32 pb-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>Partenaires</p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 44, letterSpacing: "-1.2px" }}>
            80+ partenaires sélectionnés<br />pour vous
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Chaque partenaire est audité par notre équipe selon des critères stricts : qualité de service, prix, support, satisfaction client.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div
                key={p.name}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer animate-fade-up"
                style={{
                  border: `2px solid ${p.recommended ? "#2F6BFF" : "var(--color-hairline)"}`,
                  boxShadow: p.recommended ? "var(--shadow-card)" : "var(--shadow-soft)",
                  animationDelay: `${i * 60}ms`,
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
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0" style={{ backgroundColor: p.color }}>
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
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} fill={j < Math.floor(p.rating) ? "#F59E0B" : "none"} style={{ color: "#F59E0B" }} />
                    ))}
                    <span className="text-xs font-semibold ml-1 text-primary">{p.rating}</span>
                    <span className="text-xs text-muted-foreground">({p.reviews.toLocaleString("fr-FR")} avis)</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-hairline">
                    <div>
                      <p className="text-xs text-muted-foreground">À partir de</p>
                      <p className="font-display font-bold text-lg text-primary">{p.price}</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#2F6BFF" }}>
                      Choisir <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
