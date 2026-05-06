import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { VinsalesLogo } from "@/components/VinsalesLogo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — Vinsales" },
      { name: "description", content: "Connectez-vous à votre espace Vinsales pour suivre vos demandes et accéder à vos partenaires recommandés." },
      { property: "og:title", content: "Connexion — Vinsales" },
      { property: "og:description", content: "Accédez à votre espace personnel Vinsales." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email({ message: "Email invalide" }).max(255);
const passwordSchema = z.string().min(6, { message: "6 caractères minimum" }).max(72);

type Mode = "login" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: "/profil" });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/profil" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailRes = emailSchema.safeParse(email);
    if (!emailRes.success) {
      setError(emailRes.error.issues[0].message);
      return;
    }
    const pwRes = passwordSchema.safeParse(password);
    if (!pwRes.success) {
      setError(pwRes.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: emailRes.data,
          password: pwRes.data,
          options: { emailRedirectTo: `${window.location.origin}/profil` },
        });
        if (error) throw error;
        setSuccess("Compte créé. Vérifiez votre email pour confirmer votre adresse.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailRes.data,
          password: pwRes.data,
        });
        if (error) throw error;
        // onAuthStateChange will redirect
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      // Friendlier messages
      if (msg.toLowerCase().includes("invalid login")) {
        setError("Email ou mot de passe incorrect.");
      } else if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already")) {
        setError("Un compte existe déjà avec cet email. Connectez-vous.");
      } else if (msg.toLowerCase().includes("email not confirmed")) {
        setError("Veuillez confirmer votre email avant de vous connecter.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />

      <main className="flex-1 pt-24 pb-16 relative overflow-hidden">
        {/* Decorative blobs (charte Vinsales) */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full opacity-30 blur-3xl animate-blob"
          style={{ background: "radial-gradient(circle, #2F6BFF 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl animate-blob"
          style={{ background: "radial-gradient(circle, #18C29C 0%, transparent 70%)", animationDelay: "2s" }}
        />

        <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — brand pitch */}
          <div className="hidden lg:block animate-fade-up">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{ backgroundColor: "var(--color-brand-soft)", color: "#2F6BFF" }}
            >
              <Sparkles size={14} />
              Espace entrepreneur
            </div>
            <h1
              className="font-display font-bold text-5xl leading-tight mb-6"
              style={{ color: "#0B2A4A", letterSpacing: "-1.2px" }}
            >
              Les bons choix pour
              <br />
              <span style={{ color: "#2F6BFF" }}>bien démarrer.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Connectez-vous pour suivre vos demandes, retrouver vos partenaires recommandés et
              gérer votre profil entrepreneur.
            </p>
            <ul className="space-y-3">
              {[
                "Suivi de vos demandes en temps réel",
                "Recommandations personnalisées",
                "Articles et guides sauvegardés",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "#0B2A4A" }}>
                  <CheckCircle2 size={18} style={{ color: "#18C29C" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — auth card */}
          <div className="w-full max-w-md mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div
              className="bg-white rounded-3xl p-8 sm:p-10"
              style={{
                border: "1px solid var(--color-hairline)",
                boxShadow: "0 24px 60px -20px rgba(11,42,74,0.18)",
              }}
            >
              <div className="lg:hidden flex justify-center mb-6">
                <VinsalesLogo size={42} />
              </div>

              <h2
                className="font-display font-bold text-3xl mb-2"
                style={{ color: "#0B2A4A", letterSpacing: "-0.6px" }}
              >
                {mode === "login" ? "Bon retour 👋" : "Créer un compte"}
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                {mode === "login"
                  ? "Connectez-vous pour accéder à votre espace."
                  : "Quelques secondes pour démarrer avec Vinsales."}
              </p>

              {/* Tabs */}
              <div
                className="grid grid-cols-2 p-1 rounded-xl mb-6"
                style={{ backgroundColor: "var(--color-brand-soft)" }}
              >
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError(null);
                      setSuccess(null);
                    }}
                    className="py-2.5 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: mode === m ? "#fff" : "transparent",
                      color: mode === m ? "#0B2A4A" : "#8A94A6",
                      boxShadow: mode === m ? "0 2px 8px rgba(11,42,74,0.08)" : "none",
                    }}
                  >
                    {m === "login" ? "Connexion" : "Inscription"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "#0B2A4A" }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#8A94A6" }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@entreprise.fr"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white border outline-none transition-all focus:border-brand focus:ring-2"
                      style={{
                        borderColor: "var(--color-hairline)",
                        color: "#0B2A4A",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: "#0B2A4A" }}>
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2"
                      style={{ color: "#8A94A6" }}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white border outline-none transition-all"
                      style={{
                        borderColor: "var(--color-hairline)",
                        color: "#0B2A4A",
                      }}
                    />
                  </div>
                  {mode === "signup" && (
                    <p className="text-xs mt-1.5" style={{ color: "#8A94A6" }}>
                      Au moins 6 caractères.
                    </p>
                  )}
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl text-sm animate-fade-up"
                    style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl text-sm animate-fade-up"
                    style={{ backgroundColor: "#ECFDF5", color: "#047857" }}
                  >
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{
                    backgroundColor: "#2F6BFF",
                    boxShadow: "0 8px 24px rgba(47,107,255,0.35)",
                  }}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Se connecter" : "Créer mon compte"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-6">
                En continuant, vous acceptez nos{" "}
                <Link to="/mentions-legales" className="underline hover:text-foreground">
                  mentions légales
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
