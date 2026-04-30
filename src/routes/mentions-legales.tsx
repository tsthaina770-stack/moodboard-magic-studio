import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Vinsales" },
      { name: "description", content: "Mentions légales, politique de confidentialité et CGU du site Vinsales." },
    ],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <div>
      <SiteHeader transparentOnTop />

      <section className="pt-32 pb-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>Légal</p>
          <h1 className="font-display font-bold text-white" style={{ fontSize: 40, letterSpacing: "-1px" }}>
            Mentions légales
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 prose prose-slate">
          <article className="space-y-10 text-foreground">
            <Block title="Éditeur du site">
              <p>Vinsales SAS — Filiale de JVN LAB</p>
              <p>Capital social : 10 000 €</p>
              <p>RCS Paris — Siège social : Paris, France</p>
              <p>Email : <a className="text-[#2F6BFF] hover:underline" href="mailto:contact@vinsales.fr">contact@vinsales.fr</a></p>
              <p>Téléphone : 01 00 00 00 00</p>
            </Block>

            <Block title="Directeur de la publication">
              <p>Joseph Nguyen, Président de Vinsales SAS.</p>
            </Block>

            <Block title="Hébergement">
              <p>Le site vinsales.fr est hébergé en France/UE par un prestataire conforme RGPD.</p>
            </Block>

            <Block title="Propriété intellectuelle">
              <p>L'ensemble du contenu présent sur ce site (textes, images, logos, graphismes, vidéos) est la propriété exclusive de Vinsales SAS, sauf mention contraire. Toute reproduction, représentation ou diffusion, même partielle, est interdite sans autorisation préalable écrite.</p>
            </Block>

            <Block title="Données personnelles & RGPD">
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à <a className="text-[#2F6BFF] hover:underline" href="mailto:contact@vinsales.fr">contact@vinsales.fr</a>.</p>
              <p>Les données collectées via les formulaires sont utilisées uniquement pour vous mettre en relation avec nos partenaires et conseillers, et ne sont jamais revendues à des tiers.</p>
            </Block>

            <Block title="Cookies">
              <p>Le site utilise des cookies techniques nécessaires à son bon fonctionnement, ainsi que des cookies analytiques (avec votre consentement explicite) pour améliorer l'expérience utilisateur.</p>
            </Block>

            <Block title="Bloctel">
              <p>Conformément à la loi, vous pouvez vous inscrire gratuitement sur la liste d'opposition au démarchage téléphonique sur <a className="text-[#2F6BFF] hover:underline" href="https://bloctel.gouv.fr" target="_blank" rel="noreferrer">bloctel.gouv.fr</a>.</p>
            </Block>

            <Block title="Litiges">
              <p>Tout litige relatif à l'utilisation du site est soumis au droit français. À défaut de règlement amiable, les tribunaux de Paris seront seuls compétents.</p>
            </Block>
          </article>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-xl text-primary mb-3" style={{ letterSpacing: "-0.4px" }}>{title}</h2>
      <div className="text-muted-foreground space-y-2 leading-relaxed">{children}</div>
    </section>
  );
}
