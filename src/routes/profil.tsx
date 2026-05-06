import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Building2, Save, Check, LogOut, Loader2, LayoutDashboard } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Vinsales" },
      { name: "description", content: "Gérez votre profil et vos préférences." },
    ],
  }),
  component: ProfilPage,
});

function ProfilPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({ prenom: "", nom: "", email: "", telephone: "", entreprise: "" });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase
        .from("profiles")
        .select("prenom,nom,telephone,entreprise,email")
        .eq("user_id", user.id)
        .maybeSingle();
      setData({
        prenom: p?.prenom ?? "",
        nom: p?.nom ?? "",
        telephone: p?.telephone ?? "",
        entreprise: p?.entreprise ?? "",
        email: p?.email ?? user.email ?? "",
      });
    })();
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setError(null);
    const { error } = await supabase.from("profiles").update({
      prenom: data.prenom, nom: data.nom, telephone: data.telephone, entreprise: data.entreprise,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => { await signOut(); navigate({ to: "/" }); };

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
            Gérez vos informations pour des recommandations toujours pertinentes.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-hairline shadow-sm sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-2xl uppercase" style={{ backgroundColor: "#2F6BFF" }}>
                  {(data.prenom || user.email || "?").slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-primary truncate">{data.prenom || user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link to="/dashboard" className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#2F6BFF" }}>
                  <LayoutDashboard size={14} /> Tableau de bord
                </Link>
                <Link to="/comparateur" className="block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: "#18C29C" }}>
                  Nouveau comparatif
                </Link>
                <button type="button" onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-muted"
                  style={{ borderColor: "var(--color-hairline)", color: "#0B2A4A" }}>
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            </div>
          </aside>

          <form onSubmit={submit} className="lg:col-span-2 bg-white rounded-2xl p-8 border border-hairline shadow-sm">
            <h2 className="font-display font-bold text-xl text-primary mb-6">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <Field icon={User} label="Prénom" value={data.prenom} onChange={(v) => setData((d) => ({ ...d, prenom: v }))} />
              <Field icon={User} label="Nom" value={data.nom} onChange={(v) => setData((d) => ({ ...d, nom: v }))} />
              <Field icon={Mail} label="Email" type="email" value={data.email} onChange={() => {}} disabled />
              <Field icon={Phone} label="Téléphone" type="tel" value={data.telephone} onChange={(v) => setData((d) => ({ ...d, telephone: v }))} />
              <Field icon={Building2} label="Entreprise" value={data.entreprise} onChange={(v) => setData((d) => ({ ...d, entreprise: v }))} />
            </div>
            {error && <p className="text-sm mb-4" style={{ color: "#B91C1C" }}>{error}</p>}
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ backgroundColor: saved ? "#18C29C" : "#2F6BFF" }}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <><Check size={16} /> Enregistré !</> : <><Save size={16} /> Enregistrer</>}
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, type = "text", disabled = false }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-primary mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type={type} value={value} disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border border-hairline bg-white focus:border-[#2F6BFF] transition-colors disabled:bg-muted disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
