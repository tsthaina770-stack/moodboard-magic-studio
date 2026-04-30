import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Users, Target, Heart, MapPin, Mail, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos de Vinsales — Notre mission" },
      { name: "description", content: "Vinsales aide les entrepreneurs à choisir vite et bien parmi des dizaines de services essentiels. Découvrez notre histoire et nos valeurs." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Clair & direct", desc: "Pas de jargon, pas de blabla. On vous parle business." },
  { icon: Heart, title: "Humain avant tout", desc: "Un vrai conseiller, pas un chatbot. Disponible 7j/7." },
  { icon: Award, title: "Sélection rigoureuse", desc: "80+ partenaires audités, négociés, recommandés." },
  { icon: Users, title: "Gratuit pour vous", desc: "Notre rémunération vient des partenaires, jamais de vous." },
];

const team = [
  { initial: "J", name: "Joseph Nguyen", role: "Président & Fondateur", color: "#2F6BFF" },
  { initial: "C", name: "Clara Moreau", role: "Direction Partenariats", color: "#18C29C" },
  { initial: "T", name: "Thomas Leclerc", role: "Lead Conseil", color: "#0B2A4A" },
  { initial: "S", name: "Sophie Bernard", role: "Marketing & Contenu", color: "#2F6BFF" },
];

function AboutPage() {
  return (
    <div>
      <SiteHeader transparentOnTop />

      {/* Hero */}
      <section className="pt-32 pb-20" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>À propos</p>
            <h1 className="font-display font-bold text-white mb-6" style={{ fontSize: 48, letterSpacing: "-1.4px", lineHeight: 1.1 }}>
              Le facilitateur de<br />décisions business pour<br />les <span style={{ color: "#18C29C" }}>entrepreneurs</span>.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480 }}>
              Vinsales accompagne les créateurs d'entreprise et dirigeants de TPE/PME pour choisir rapidement les services essentiels à leur activité.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-fade-up delay-200">
            {[
              { value: "1 200+", label: "Entrepreneurs accompagnés" },
              { value: "80+", label: "Partenaires actifs" },
              { value: "8", label: "Catégories de services" },
              { value: "4.9/5", label: "Satisfaction client" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <p className="font-display font-bold text-3xl text-white mb-1">{value}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Notre mission</p>
          <h2 className="font-display font-bold text-primary mb-6" style={{ fontSize: 36, letterSpacing: "-0.8px" }}>
            Faire gagner du temps aux dirigeants
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Créer une entreprise, c'est faire face à un déluge de choix : domiciliation, banque, comptable, assureur, fournisseur d'énergie, outil de paie...
            Vinsales vous donne les bonnes réponses, rapidement, par un vrai conseiller — pas un formulaire anonyme. Notre service est <strong className="text-primary">100% gratuit</strong>, financé par les partenaires que nous vous recommandons.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#2F6BFF", letterSpacing: 2 }}>Nos valeurs</p>
            <h2 className="font-display font-bold text-primary" style={{ fontSize: 32, letterSpacing: "-0.6px" }}>Ce qui nous fait avancer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-hairline transition-all hover:-translate-y-1 hover:shadow-lg animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "var(--color-brand-soft)" }}>
                  <Icon size={22} style={{ color: "#2F6BFF" }} />
                </div>
                <h3 className="font-display font-bold text-primary mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: "#2F6BFF", letterSpacing: 2 }}>L'équipe</p>
            <h2 className="font-display font-bold text-primary" style={{ fontSize: 32, letterSpacing: "-0.6px" }}>Une équipe à votre écoute</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ initial, name, role, color }, i) => (
              <div key={name} className="text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white font-display font-bold text-3xl mb-4 transition-transform hover:scale-105" style={{ backgroundColor: color }}>
                  {initial}
                </div>
                <p className="font-display font-bold text-primary">{name}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20" style={{ backgroundColor: "#0B2A4A" }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 32, letterSpacing: "-0.8px" }}>
            Une question ? Contactez-nous
          </h2>
          <p className="mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
            Notre équipe est joignable du lundi au samedi, de 9h à 19h.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Phone, label: "01 00 00 00 00", sub: "Lun–Sam · 9h–19h", href: "tel:+33100000000" },
              { icon: Mail, label: "contact@vinsales.fr", sub: "Réponse sous 24h", href: "mailto:contact@vinsales.fr" },
              { icon: MapPin, label: "Paris, France", sub: "Filiale de JVN LAB", href: "#" },
            ].map(({ icon: Icon, label, sub, href }) => (
              <a key={label} href={href} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all hover:-translate-y-1 hover:bg-white/10">
                <Icon size={22} className="mx-auto mb-3" style={{ color: "#7EAEFF" }} />
                <p className="font-display font-semibold text-white text-sm mb-1">{label}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{sub}</p>
              </a>
            ))}
          </div>
          <Link
            to="/comparateur"
            className="inline-flex items-center gap-2 mt-10 px-7 py-4 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "#2F6BFF", boxShadow: "var(--shadow-cta)" }}
          >
            Lancer mon comparatif
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
