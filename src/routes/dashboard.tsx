import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2, Users, FileText, BarChart3, MousePointerClick, Building2,
  TrendingUp, Newspaper, Settings, LogOut, ShieldCheck, Briefcase,
  ArrowRight, CheckCircle2, Clock, Sparkles, Target, Rocket, BookOpen,
  Calendar, Activity, ChevronRight, Search, Bell,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/use-auth";
import { useRole, type AppRole } from "@/hooks/use-role";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Vinsales" },
      { name: "description", content: "Espace personnel Vinsales : suivez vos demandes, vos partenaires et vos performances." },
    ],
  }),
  component: DashboardPage,
});

type Stats = {
  leads?: number;
  articles?: number;
  partenaires?: number;
  clics?: number;
};

function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { primary, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({});
  const [profile, setProfile] = useState<{ prenom: string | null; nom: string | null; entreprise: string | null } | null>(null);

  const [recentLeads, setRecentLeads] = useState<Array<{ id: string; sujet: string | null; statut: string; created_at: string }>>([]);
  const [latestArticles, setLatestArticles] = useState<Array<{ id: string; titre: string; slug: string; extrait: string | null; temps_lecture_min: number | null }>>([]);
  const [topPartenaires, setTopPartenaires] = useState<Array<{ id: string; nom: string; description: string | null; logo_url: string | null }>>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase
        .from("profiles").select("prenom,nom,entreprise").eq("user_id", user.id).maybeSingle();
      setProfile(prof);

      const [leads, articles, partenaires, clics, recent, art, parts] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }),
        supabase.from("articles").select("*", { count: "exact", head: true }),
        supabase.from("partenaires").select("*", { count: "exact", head: true }),
        supabase.from("clics_partenaires").select("*", { count: "exact", head: true }),
        supabase.from("leads").select("id,sujet,statut,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("articles").select("id,titre,slug,extrait,temps_lecture_min").eq("statut", "publie").order("publie_le", { ascending: false }).limit(3),
        supabase.from("partenaires").select("id,nom,description,logo_url").eq("actif", true).order("ordre_affichage").limit(4),
      ]);
      setStats({
        leads: leads.count ?? 0,
        articles: articles.count ?? 0,
        partenaires: partenaires.count ?? 0,
        clics: clics.count ?? 0,
      });
      setRecentLeads(recent.data ?? []);
      setLatestArticles(art.data ?? []);
      setTopPartenaires(parts.data ?? []);
    })();
  }, [user]);

  if (authLoading || roleLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" style={{ color: "#2F6BFF" }} size={32} />
      </div>
    );
  }

  const handleLogout = async () => { await signOut(); navigate({ to: "/" }); };
  const displayName = profile?.prenom || user.email?.split("@")[0] || "entrepreneur";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      <section className="pt-32 pb-10" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto px-6 animate-fade-up flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <RoleBadge role={primary} />
            </div>
            <h1 className="font-display font-bold text-white" style={{ fontSize: 36, letterSpacing: "-1px" }}>
              Bonjour, {displayName} 👋
            </h1>
            <p className="text-base mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              {dashboardSubtitle(primary)}
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/profil"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <Settings size={15} /> Profil
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <LogOut size={15} /> Déconnexion
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {primary === "admin" && <AdminView stats={stats} />}
        {primary === "partenaire" && <PartenaireView stats={stats} />}
        {(primary === "createur" || primary === "visiteur") && <CreateurView stats={stats} />}
      </main>

      <SiteFooter />
    </div>
  );
}

function dashboardSubtitle(role: AppRole) {
  if (role === "admin") return "Pilotez le contenu, les partenaires et les leads de la plateforme.";
  if (role === "partenaire") return "Suivez vos leads et la performance de vos campagnes.";
  return "Retrouvez vos comparatifs, vos articles et vos contacts.";
}

function RoleBadge({ role }: { role: AppRole }) {
  const map: Record<AppRole, { label: string; icon: React.ReactNode; bg: string; color: string }> = {
    admin:      { label: "Administrateur", icon: <ShieldCheck size={12} />, bg: "rgba(24,194,156,0.18)", color: "#4FDFC0" },
    partenaire: { label: "Partenaire",     icon: <Briefcase size={12} />,   bg: "rgba(255,193,7,0.18)",  color: "#FFD54F" },
    createur:   { label: "Entrepreneur",   icon: <TrendingUp size={12} />,  bg: "rgba(126,174,255,0.2)", color: "#7EAEFF" },
    visiteur:   { label: "Visiteur",       icon: <Users size={12} />,       bg: "rgba(255,255,255,0.1)", color: "#ffffff" },
  };
  const c = map[role];
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.color}33` }}>
      {c.icon} {c.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-hairline shadow-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}1a` }}>
          <Icon size={18} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
      <p className="font-display font-bold text-3xl text-primary">{value}</p>
    </div>
  );
}

function AdminView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-10 animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Leads" value={stats.leads ?? 0} color="#2F6BFF" />
        <StatCard icon={Building2} label="Partenaires" value={stats.partenaires ?? 0} color="#18C29C" />
        <StatCard icon={Newspaper} label="Articles" value={stats.articles ?? 0} color="#0B2A4A" />
        <StatCard icon={MousePointerClick} label="Clics" value={stats.clics ?? 0} color="#FF6B6B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionCard icon={Building2} title="Gérer les partenaires" desc="Ajoutez et organisez les fiches partenaires." color="#18C29C" />
        <ActionCard icon={Newspaper} title="Gérer le blog" desc="Publiez articles SEO et guides PDF." color="#2F6BFF" />
        <ActionCard icon={FileText} title="Configurer les comparateurs" desc="Questions, scoring et catégories." color="#0B2A4A" />
        <ActionCard icon={BarChart3} title="Analytics" desc="Conversions, trafic et performance des leads." color="#FF6B6B" />
      </div>
    </div>
  );
}

function PartenaireView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-10 animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Mes leads" value={stats.leads ?? 0} color="#2F6BFF" />
        <StatCard icon={MousePointerClick} label="Clics reçus" value={stats.clics ?? 0} color="#18C29C" />
        <StatCard icon={TrendingUp} label="Taux de conversion" value="—" color="#0B2A4A" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActionCard icon={Building2} title="Ma fiche partenaire" desc="Mettez à jour votre offre, votre logo et votre description." color="#2F6BFF" />
        <ActionCard icon={BarChart3} title="Mes statistiques" desc="Trafic, leads et conversions générés." color="#18C29C" />
      </div>
    </div>
  );
}

function CreateurView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-10 animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={FileText} label="Mes demandes" value={stats.leads ?? 0} color="#2F6BFF" />
        <StatCard icon={Newspaper} label="Articles disponibles" value={stats.articles ?? 0} color="#18C29C" />
        <StatCard icon={Building2} label="Partenaires actifs" value={stats.partenaires ?? 0} color="#0B2A4A" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link to="/comparateur" className="block">
          <ActionCard icon={TrendingUp} title="Lancer un comparatif" desc="Trouvez les bons partenaires en 2 minutes." color="#2F6BFF" />
        </Link>
        <Link to="/blog" className="block">
          <ActionCard icon={Newspaper} title="Lire les guides" desc="Conseils et tutos pour entrepreneurs." color="#18C29C" />
        </Link>
        <Link to="/profil" className="block">
          <ActionCard icon={Settings} title="Mon profil" desc="Complétez vos infos pour un meilleur suivi." color="#0B2A4A" />
        </Link>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, color }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; title: string; desc: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-hairline shadow-sm hover-lift hover:-translate-y-1 hover:shadow-card transition-all cursor-pointer h-full">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}1a` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <h3 className="font-display font-bold text-lg text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
