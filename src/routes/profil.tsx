import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, Save, Check, LogOut, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Vinsales" },
      { name: "description", content: "Gérez votre profil et vos préférences pour recevoir les meilleures recommandations." },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    societe: "",
    statut: "SASU",
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
    if (user) setData((d) => ({ ...d, email: user.email ?? "" }));
  }, [user, loading, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" style={{ color: "#2F6BFF" }} size={32} />
      </div>
    );
  }

  return (
    <div>
      <SiteHeader transparentOnTop />

      <section className="pt-32 pb-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-4xl mx-auto px-6 animate-fade-up">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>Mon espace</p>
          <h1 className="font-display font-bold text-white mb-2" style={{ fontSize: 40, letterSpacing: "-1px" }}>
            Mon profil
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.65)" }}>
            Gérez vos informations et vos préférences pour des recommandations toujours pertinentes.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-hairline shadow-sm sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl" style={{ backgroundColor: "#2F6BFF" }}>
                  {data.prenom[0]}{data.nom[0]}
                </div>
                <div>
                  <p className="font-display font-bold text-primary">{data.prenom} {data.nom}</p>
                  <p className="text-xs text-muted-foreground">{data.societe}</p>
                </div>
              </div>
              <nav className="space-y-1 text-sm">
                {["Profil", "Mes services", "Mes documents", "Mes rendez-vous"].map((item, i) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor: i === 0 ? "var(--color-brand-soft)" : "transparent",
                      color: i === 0 ? "#2F6BFF" : "#8A94A6",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <div className="mt-6 pt-6 border-t border-hairline">
                <Link to="/comparateur" className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#18C29C" }}>
                  Nouveau comparatif
                </Link>
              </div>
            </div>
          </aside>

          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-2xl p-8 border border-hairline shadow-sm">
            <h2 className="font-display font-bold text-xl text-primary mb-6">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <Field icon={User} label="Prénom" value={data.prenom} onChange={(v) => setData((d) => ({ ...d, prenom: v }))} />
              <Field icon={User} label="Nom" value={data.nom} onChange={(v) => setData((d) => ({ ...d, nom: v }))} />
              <Field icon={Mail} label="Email" type="email" value={data.email} onChange={(v) => setData((d) => ({ ...d, email: v }))} />
              <Field icon={Phone} label="Téléphone" type="tel" value={data.telephone} onChange={(v) => setData((d) => ({ ...d, telephone: v }))} />
              <Field icon={Building2} label="Société" value={data.societe} onChange={(v) => setData((d) => ({ ...d, societe: v }))} />
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Statut juridique</label>
                <select
                  value={data.statut}
                  onChange={(e) => setData((d) => ({ ...d, statut: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none border border-hairline bg-white focus:border-[#2F6BFF] transition-colors"
                >
                  {["Auto-entrepreneur", "SASU", "SARL", "EURL", "SAS"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: saved ? "#18C29C" : "#2F6BFF" }}
            >
              {saved ? (
                <>
                  <Check size={16} /> Enregistré !
                </>
              ) : (
                <>
                  <Save size={16} /> Enregistrer les modifications
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  icon: Icon, label, value, onChange, type = "text",
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-primary mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-hairline bg-white focus:border-[#2F6BFF] transition-colors"
        />
      </div>
    </div>
  );
}
