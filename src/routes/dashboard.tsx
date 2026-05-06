import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2, Users, FileText, BarChart3, MousePointerClick, Building2,
  TrendingUp, Newspaper, Settings, LogOut, ShieldCheck, Briefcase,
  ArrowRight, CheckCircle2, Clock, Sparkles, Target, Rocket, BookOpen,
  Calendar, Activity, ChevronRight, Bell,
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
        {(primary === "createur" || primary === "visiteur") && (
          <CreateurView
            stats={stats}
            recentLeads={recentLeads}
            latestArticles={latestArticles}
            topPartenaires={topPartenaires}
            profileComplete={Boolean(profile?.prenom && profile?.nom && profile?.entreprise)}
          />
        )}
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

function StatCard({ icon: Icon, label, value, color, trend, sub }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; value: string | number; color: string; trend?: string; sub?: string }) {
  return (
    <div className="group relative bg-white rounded-2xl p-5 border border-hairline overflow-hidden hover:-translate-y-1 hover:shadow-card transition-all duration-300">
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-2xl"
        style={{ backgroundColor: color }} />
      <div className="flex items-center justify-between mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-110"
          style={{ backgroundColor: `${color}1a` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <span className="text-[11px] font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: "rgba(24,194,156,0.12)", color: "#18C29C" }}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="font-display font-bold text-3xl text-primary leading-none">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-2">{sub}</p>}
    </div>
  );
}

function AdminView({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-10 animate-fade-up">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Leads" value={stats.leads ?? 0} color="#2F6BFF" trend="+12%" />
        <StatCard icon={Building2} label="Partenaires" value={stats.partenaires ?? 0} color="#18C29C" />
        <StatCard icon={Newspaper} label="Articles" value={stats.articles ?? 0} color="#0B2A4A" />
        <StatCard icon={MousePointerClick} label="Clics" value={stats.clics ?? 0} color="#FF6B6B" trend="+8%" />
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

function CreateurView({
  stats, recentLeads, latestArticles, topPartenaires, profileComplete,
}: {
  stats: Stats;
  recentLeads: Array<{ id: string; sujet: string | null; statut: string; created_at: string }>;
  latestArticles: Array<{ id: string; titre: string; slug: string; extrait: string | null; temps_lecture_min: number | null }>;
  topPartenaires: Array<{ id: string; nom: string; description: string | null; logo_url: string | null }>;
  profileComplete: boolean;
}) {
  const [filter, setFilter] = useState<"all" | "nouveau" | "contacte" | "ferme">("all");
  const filtered = useMemo(
    () => filter === "all" ? recentLeads : recentLeads.filter((l) => l.statut === filter),
    [recentLeads, filter]
  );

  // Onboarding checklist
  const steps = [
    { key: "profil", label: "Compléter mon profil", done: profileComplete, to: "/profil", icon: UserIconSettings },
    { key: "compa",  label: "Lancer un premier comparatif", done: (stats.leads ?? 0) > 0, to: "/comparateur", icon: Target },
    { key: "lecture", label: "Consulter un guide", done: false, to: "/blog", icon: BookOpen },
    { key: "rappel", label: "Demander à être rappelé", done: (stats.leads ?? 0) > 0, to: "/comparateur", icon: PhoneRing },
  ];
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="space-y-10 animate-fade-up">
      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Mes demandes" value={stats.leads ?? 0} color="#2F6BFF" sub="Suivez vos contacts" />
        <StatCard icon={Building2} label="Partenaires actifs" value={stats.partenaires ?? 0} color="#18C29C" sub="Triés sur le volet" />
        <StatCard icon={Newspaper} label="Guides dispo" value={stats.articles ?? 0} color="#0B2A4A" sub="Mis à jour chaque semaine" />
        <StatCard icon={Activity} label="Score profil" value={`${pct}%`} color="#FF6B6B" sub="Complétez pour 100%" />
      </div>

      {/* Onboarding progress */}
      <div className="relative bg-white rounded-3xl p-6 lg:p-8 border border-hairline overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "radial-gradient(circle,#2F6BFF,transparent)" }} />
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6 relative">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: "rgba(47,107,255,0.1)", color: "#2F6BFF" }}>
              <Rocket size={12} /> Démarrage
            </div>
            <h2 className="font-display font-bold text-2xl text-primary">Lancez votre activité en 4 étapes</h2>
            <p className="text-sm text-muted-foreground mt-1">{doneCount}/{steps.length} étapes complétées</p>
          </div>
          <div className="text-right">
            <div className="font-display font-bold text-4xl"
              style={{ background: "linear-gradient(135deg,#2F6BFF,#18C29C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {pct}%
            </div>
            <p className="text-xs text-muted-foreground">progression</p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-6" style={{ backgroundColor: "var(--color-brand-soft)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg,#2F6BFF,#18C29C)" }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {steps.map((s, i) => (
            <Link key={s.key} to={s.to}
              className="group flex items-center gap-3 p-4 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-soft"
              style={{
                borderColor: s.done ? "rgba(24,194,156,0.3)" : "var(--color-hairline)",
                backgroundColor: s.done ? "rgba(24,194,156,0.05)" : "#fff",
                animationDelay: `${i * 80}ms`,
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: s.done ? "#18C29C" : "var(--color-brand-soft)" }}>
                {s.done ? <CheckCircle2 size={18} className="text-white" /> : <s.icon size={18} style={{ color: "#2F6BFF" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-primary">{s.label}</p>
                <p className="text-xs text-muted-foreground">
                  {s.done ? "Terminé" : "Cliquez pour démarrer"}
                </p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 group-hover:text-brand transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Activité récente + Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-hairline">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Activity size={18} style={{ color: "#2F6BFF" }} />
              <h3 className="font-display font-bold text-lg text-primary">Mon activité récente</h3>
            </div>
            <div className="flex gap-1 p-1 rounded-full" style={{ backgroundColor: "var(--color-brand-soft)" }}>
              {(["all", "nouveau", "contacte"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: filter === f ? "#fff" : "transparent",
                    color: filter === f ? "#0B2A4A" : "#8A94A6",
                    boxShadow: filter === f ? "0 2px 6px rgba(11,42,74,0.08)" : "none",
                  }}>
                  {f === "all" ? "Tous" : f === "nouveau" ? "Nouveaux" : "Contactés"}
                </button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "linear-gradient(135deg,#EFF4FF,#E6F9F5)" }}>
                <Sparkles size={26} style={{ color: "#2F6BFF" }} />
              </div>
              <p className="font-semibold text-primary mb-1">Aucune demande pour le moment</p>
              <p className="text-sm text-muted-foreground mb-4">Lancez votre premier comparatif pour recevoir vos recommandations.</p>
              <Link to="/comparateur"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#2F6BFF,#1E4FD9)" }}>
                Lancer un comparatif <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.map((l, i) => (
                <li key={l.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-hairline hover:bg-brand-soft transition-colors"
                  style={{ animation: `vin-fade-up 0.4s ${i * 50}ms both` }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: statusColor(l.statut).bg }}>
                    <FileText size={16} style={{ color: statusColor(l.statut).c }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-primary truncate">{l.sujet || "Demande de mise en relation"}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Calendar size={11} /> {new Date(l.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: statusColor(l.statut).bg, color: statusColor(l.statut).c }}>
                    {l.statut}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Suggested partenaires */}
        <div className="bg-white rounded-2xl p-6 border border-hairline">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} style={{ color: "#18C29C" }} />
            <h3 className="font-display font-bold text-lg text-primary">Pour vous</h3>
          </div>
          {topPartenaires.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bientôt des recommandations personnalisées.</p>
          ) : (
            <ul className="space-y-3">
              {topPartenaires.map((p, i) => (
                <li key={p.id}
                  className="flex gap-3 items-start group cursor-pointer"
                  style={{ animation: `vin-fade-up 0.4s ${i * 60}ms both` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
                    style={{ background: ["#0B2A4A", "#2F6BFF", "#18C29C", "#FF6B6B"][i % 4] }}>
                    {p.nom[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-primary group-hover:text-brand transition-colors truncate">{p.nom}</p>
                    {p.description && <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/partenaires"
            className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#18C29C,#0FA37F)" }}>
            Voir tous les partenaires <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Latest articles */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen size={18} style={{ color: "#2F6BFF" }} />
            <h3 className="font-display font-bold text-lg text-primary">Derniers guides pour entrepreneurs</h3>
          </div>
          <Link to="/blog" className="text-sm font-semibold flex items-center gap-1 text-brand hover:gap-2 transition-all" style={{ color: "#2F6BFF" }}>
            Tous les articles <ArrowRight size={14} />
          </Link>
        </div>
        {latestArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-hairline text-center text-sm text-muted-foreground">
            Les articles seront bientôt publiés.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestArticles.map((a, i) => (
              <Link key={a.id} to="/blog"
                className="block bg-white rounded-2xl p-5 border border-hairline hover:-translate-y-1 hover:shadow-card transition-all group"
                style={{ animation: `vin-fade-up 0.4s ${i * 80}ms both` }}>
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  <Clock size={12} /> {a.temps_lecture_min ?? 5} min de lecture
                </div>
                <h4 className="font-display font-bold text-base text-primary mb-2 line-clamp-2 group-hover:text-brand transition-colors">{a.titre}</h4>
                {a.extrait && <p className="text-xs text-muted-foreground line-clamp-3">{a.extrait}</p>}
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#2F6BFF" }}>
                  Lire l'article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function statusColor(s: string) {
  switch (s) {
    case "nouveau":  return { bg: "rgba(47,107,255,0.12)",  c: "#2F6BFF" };
    case "contacte": return { bg: "rgba(255,193,7,0.16)",   c: "#D69E00" };
    case "ferme":    return { bg: "rgba(24,194,156,0.14)",  c: "#18C29C" };
    default:         return { bg: "rgba(138,148,166,0.16)", c: "#5A6577" };
  }
}

// helper alias icons (avoid name clash with imports)
const UserIconSettings = Settings;
const PhoneRing = Bell;

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
