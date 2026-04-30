import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Calendar, Eye, Heart, ArrowRight, ChevronRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { articles } from "@/lib/site-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog Vinsales — Conseils pour entrepreneurs" },
      { name: "description", content: "Guides pratiques, comparatifs et analyses pour créateurs d'entreprise et dirigeants de TPE/PME." },
    ],
  }),
  component: BlogPage,
});

const categories = ["Tous", "Création", "Entrepreneuriat", "Banque pro", "Finance", "Fiscalité", "Assurance"] as const;

function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("Tous");
  const [saved, setSaved] = useState<number[]>([]);

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Tous" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter((a) => a.featured).slice(0, 3);
  const regular = filtered.filter((a) => !a.featured);

  const toggleSave = (id: number) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div>
      <SiteHeader transparentOnTop />

      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-up">
          <p className="text-xs font-semibold uppercase mb-4" style={{ color: "#18C29C", letterSpacing: 2 }}>Blog</p>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 44, letterSpacing: "-1.2px" }}>
            Conseils et actualités pour<br />entrepreneurs
          </h1>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Découvrez nos guides pratiques, analyses détaillées et meilleures pratiques pour réussir votre projet.
          </p>
        </div>
      </section>

      {/* Search & filter */}
      <section className="py-10 bg-white border-b border-hairline">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-6">
            <div className="flex-1 w-full lg:w-auto relative">
              <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#8A94A6" }} />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all text-sm bg-background focus:border-[#2F6BFF]"
                style={{ border: "1.5px solid transparent" }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{filtered.length} article(s)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  backgroundColor: activeCategory === cat ? "#0B2A4A" : "white",
                  color: activeCategory === cat ? "white" : "#8A94A6",
                  border: `1.5px solid ${activeCategory === cat ? "#0B2A4A" : "var(--color-hairline)"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display font-bold text-2xl mb-8" style={{ letterSpacing: "-0.6px" }}>À la une</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((article, i) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group border border-hairline animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="relative overflow-hidden h-48 bg-gray-200">
                    <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: "#2F6BFF" }}>
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-base mb-2 group-hover:text-[#2F6BFF] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm mb-4 text-muted-foreground">{article.excerpt}</p>
                    <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                      <span>{article.readTime}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {article.views.toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-hairline">
                      <div>
                        <p className="text-xs font-semibold">{article.author}</p>
                        <p className="text-xs flex items-center gap-1 text-muted-foreground">
                          <Calendar size={11} /> {article.date}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSave(article.id)}
                        className="ml-auto p-2 rounded-lg transition-all"
                        style={{
                          backgroundColor: saved.includes(article.id) ? "#FFE8E8" : "#F5F7FA",
                          color: saved.includes(article.id) ? "#FF6B6B" : "#8A94A6",
                        }}
                        aria-label="Sauvegarder"
                      >
                        <Heart size={16} fill={saved.includes(article.id) ? "#FF6B6B" : "none"} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All */}
      {regular.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display font-bold text-2xl mb-8" style={{ letterSpacing: "-0.6px" }}>Tous les articles</h2>
            <div className="space-y-4">
              {regular.map((article, i) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:translate-x-1 group flex gap-6 border border-hairline animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="hidden sm:block w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display font-bold group-hover:text-[#2F6BFF] transition-colors">{article.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: "#2F6BFF" }}>
                        {article.category}
                      </span>
                    </div>
                    <p className="text-sm mb-3 text-muted-foreground">{article.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span>{article.readTime}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {article.views.toLocaleString("fr-FR")}
                      </span>
                      <span>{article.author}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {article.date}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center">
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#2F6BFF" }} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section className="py-20 text-center">
          <p className="text-lg text-muted-foreground">Aucun article trouvé.</p>
          <button
            onClick={() => { setSearch(""); setActiveCategory("Tous"); }}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2"
            style={{ backgroundColor: "#2F6BFF" }}
          >
            Réinitialiser les filtres
          </button>
        </section>
      )}

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: "#0B2A4A" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display font-bold text-white mb-4" style={{ fontSize: 32, letterSpacing: "-0.8px" }}>
            Prêt à bien démarrer ?
          </h2>
          <p className="text-base mb-6 mx-auto max-w-2xl" style={{ color: "rgba(255,255,255,0.65)" }}>
            Comparez les meilleures offres et trouvez les partenaires idéaux pour votre entreprise.
          </p>
          <Link
            to="/comparateur"
            className="px-7 py-4 rounded-xl font-semibold text-white inline-flex items-center gap-2 transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: "#2F6BFF", boxShadow: "var(--shadow-cta)" }}
          >
            Accéder au comparateur <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
