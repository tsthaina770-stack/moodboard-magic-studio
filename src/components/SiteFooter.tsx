import { Link } from "@tanstack/react-router";
import { VinsalesLogo } from "./VinsalesLogo";

const sections = [
  {
    title: "Services",
    links: [
      { label: "Domiciliation", to: "/comparateur" },
      { label: "Banque pro", to: "/comparateur" },
      { label: "Comptabilité", to: "/comparateur" },
      { label: "Assurance", to: "/comparateur" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Comment ça marche", to: "/comment-ca-marche" },
      { label: "Partenaires", to: "/partenaires" },
      { label: "Mon profil", to: "/profil" },
    ],
  },
  {
    title: "Société",
    links: [
      { label: "À propos", to: "/about" },
      { label: "Mentions légales", to: "/mentions-legales" },
      { label: "Contact", to: "/about" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer style={{ backgroundColor: "#071D33" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-5">
              <VinsalesLogo size={32} light />
              <span className="font-display font-bold text-xl text-white" style={{ letterSpacing: "-0.4px" }}>
                Vinsales
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Le comparateur de confiance pour les créateurs d'entreprise.
            </p>
            <p className="text-xs font-semibold" style={{ color: "#18C29C" }}>
              Les bons choix pour bien démarrer.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <p
                className="text-xs font-semibold uppercase mb-5"
                style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px" }}
              >
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026 Vinsales · Tous droits réservés · Paris, France
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/mentions-legales" className="hover:text-white transition-colors">CGU</Link>
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
