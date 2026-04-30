import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, TrendingUp, MessageCircle, Check, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Vinsales" },
      { name: "description", content: "Découvrez comment Vinsales sélectionne pour vous les meilleurs services en 4 étapes simples." },
    ],
  }),
  component: HowPage,
});

const steps = [
  { icon: Zap, num: "01", title: "Renseignez votre profil", desc: "En 2 minutes, indiquez votre statut juridique, votre secteur d'activité, vos besoins et votre budget. Plus c'est précis, plus nos recommandations seront pertinentes." },
  { icon: TrendingUp, num: "02", title: "Recevez vos offres personnalisées", desc: "Notre algorithme croise votre profil avec notre catalogue de 80+ partenaires audités. Vous obtenez instantanément les 3 à 5 meilleures offres pour vous." },
  { icon: MessageCircle, num: "03", title: "Échangez avec un expert", desc: "Un conseiller Vinsales vous rappelle gratuitement sous 24h pour vous expliquer les options, négocier les conditions et répondre à toutes vos questions." },
  { icon: Check, num: "04", title: "Activez votre service en confiance", desc: "Vous choisissez l'offre qui vous convient. Vinsales vous accompagne dans la souscription et reste à vos côtés après. Sans frais, sans engagement." },
];

function HowPage() {
  return (
    <div>
      <SiteHeader transparentOnTop />

      <section className="pt-32 pb-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>Comment ça marche</p>
          <h1 className="font-display font-bold text-white mb-6" style={{ fontSize: 44, letterSpacing: "-1.2px" }}>
            4 étapes pour bien démarrer
          </h1>
          <p className="text-lg mx-auto" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 600 }}>
            Un processus simple, transparent et sans engagement. Vinsales vous fait gagner du temps là où ça compte.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          {steps.map(({ icon: Icon, num, title, desc }, i) => (
            <div
              key={num}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div
                  className="aspect-[4/3] rounded-3xl flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, var(--color-brand-soft), white)" }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
                    style={{ background: "radial-gradient(circle, #2F6BFF, transparent)" }}
                  />
                  <div
                    className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: "#2F6BFF" }}
                  >
                    <Icon size={56} className="text-white" />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <span className="text-7xl font-display font-bold" style={{ color: "var(--color-brand-soft)" }}>
                  {num}
                </span>
                <h2 className="font-display font-bold text-3xl text-primary mt-2 mb-4" style={{ letterSpacing: "-0.8px" }}>
                  {title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: "#0B2A4A" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 32, letterSpacing: "-0.8px" }}>
            Prêt à passer à l'action ?
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
            Comparez gratuitement les meilleures offres adaptées à votre projet en 2 minutes.
          </p>
          <Link
            to="/comparateur"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "#2F6BFF", boxShadow: "var(--shadow-cta)" }}
          >
            Démarrer le comparateur <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
