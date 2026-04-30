import { Building2, CreditCard, Calculator, Shield, Zap, Phone as PhoneIcon, Users, Briefcase } from "lucide-react";

export const services = [
  { slug: "domiciliation", icon: Building2, label: "Domiciliation", desc: "Adresse légale prestigieuse pour votre entreprise", count: "34 offres", from: "12€/mois", color: "#2F6BFF", bg: "#EFF4FF" },
  { slug: "banque-pro",     icon: CreditCard, label: "Banque pro",   desc: "Compte professionnel adapté à votre activité",      count: "18 offres", from: "0€/mois",  color: "#0B2A4A", bg: "#E8F0FE" },
  { slug: "comptabilite",   icon: Calculator, label: "Comptabilité", desc: "Expert-comptable en ligne ou cabinet traditionnel", count: "22 offres", from: "29€/mois", color: "#18C29C", bg: "#E6F9F5" },
  { slug: "assurance",      icon: Shield,     label: "Assurance",    desc: "RC Pro, mutuelle et prévoyance pour votre statut", count: "15 offres", from: "9€/mois",  color: "#2F6BFF", bg: "#EFF4FF" },
  { slug: "energie",        icon: Zap,        label: "Énergie",      desc: "Électricité et gaz pro à tarif négocié",           count: "12 offres", from: "Sur devis", color: "#18C29C", bg: "#E6F9F5" },
  { slug: "telecom",        icon: PhoneIcon,  label: "Télécoms",     desc: "Internet, mobile et téléphonie d'entreprise",       count: "10 offres", from: "19€/mois", color: "#0B2A4A", bg: "#E8F0FE" },
  { slug: "rh",             icon: Users,      label: "Outils RH",    desc: "Paie, recrutement, onboarding simplifiés",          count: "8 offres",  from: "39€/mois", color: "#2F6BFF", bg: "#EFF4FF" },
  { slug: "paiement",       icon: Briefcase,  label: "Paiement",     desc: "Solutions d'encaissement et terminaux pro",         count: "9 offres",  from: "0,4%/tx",  color: "#18C29C", bg: "#E6F9F5" },
] as const;

export const partners = [
  { initial: "S", name: "Shine",        category: "Banque pro",   location: "France",   rating: 4.8, reviews: 2340, price: "7,90€/mois", tags: ["Sans engagement", "Carte Visa Business"], recommended: true,  desc: "La banque pro 100% mobile pensée pour les freelances et TPE. Interface intuitive, support réactif.", color: "#0B2A4A" },
  { initial: "Q", name: "Qonto",        category: "Banque pro",   location: "France",   rating: 4.7, reviews: 5180, price: "9€/mois",     tags: ["Multi-utilisateurs", "Intégrations comptables"], recommended: false, desc: "La référence des fintech françaises. Idéale pour les équipes et les entreprises en croissance.", color: "#2F6BFF" },
  { initial: "D", name: "DomiFrance Pro", category: "Domiciliation", location: "Paris 8e", rating: 4.9, reviews: 890,  price: "19€/mois",    tags: ["Adresse prestigieuse", "Courrier numérique"], recommended: true,  desc: "Adresse Champs-Élysées avec scanning et réexpédition courrier. Accueil secrétariat inclus.", color: "#18C29C" },
  { initial: "K", name: "Kandbaz",      category: "Domiciliation", location: "Paris",    rating: 4.6, reviews: 1450, price: "12€/mois",    tags: ["Pas cher", "100% en ligne"],                  recommended: false, desc: "Domiciliation low-cost en ligne avec espace client complet. Idéal pour les freelances.",     color: "#2F6BFF" },
  { initial: "I", name: "Indy",         category: "Comptabilité", location: "Lyon",     rating: 4.9, reviews: 3210, price: "29€/mois",    tags: ["Logiciel complet", "Liasse fiscale incluse"], recommended: true,  desc: "Logiciel de compta pour freelances. Automatisation et accompagnement par des experts.",      color: "#18C29C" },
  { initial: "H", name: "Hiscox",       category: "Assurance",    location: "France",   rating: 4.7, reviews: 1820, price: "13€/mois",    tags: ["RC Pro", "Cyber-risque inclus"],              recommended: false, desc: "Assureur référent pour les TPE et professions du conseil. Couverture sur-mesure.",         color: "#0B2A4A" },
] as const;

export const testimonials = [
  { name: "Marie D.",  role: "Fondatrice SASU — Conseil RH",       text: "En moins d'une heure, j'avais comparé 8 banques et choisi ma domiciliation. Le conseiller Vinsales m'a rappelée le jour même et m'a guidée pas à pas.", rating: 5, avatar: "M", color: "#2F6BFF" },
  { name: "Thomas L.", role: "Auto-entrepreneur — Développeur web", text: "J'avais peur de me perdre dans les démarches. Vinsales m'a permis de trouver un expert-comptable adapté à mon budget en quelques clics. Top.",       rating: 5, avatar: "T", color: "#0B2A4A" },
  { name: "Sophie M.", role: "Gérante EURL — Consulting",           text: "Le service est entièrement gratuit et le comparateur est vraiment objectif. J'ai économisé 40% sur ma comptabilité par rapport à mon ancien prestataire.", rating: 5, avatar: "S", color: "#18C29C" },
] as const;

export const faqs = [
  { q: "Vinsales est-il vraiment gratuit ?",                          a: "Oui, notre service est 100% gratuit pour les entrepreneurs. Nous sommes rémunérés par nos partenaires sous forme de commissions, uniquement lorsqu'une mise en relation aboutit à une souscription. Cela ne change jamais le prix que vous payez." },
  { q: "Comment fonctionne le comparateur ?",                         a: "Notre algorithme analyse votre profil (statut juridique, secteur, besoins, budget) et vous propose les offres les plus adaptées parmi notre réseau de 80+ partenaires vérifiés. Les résultats sont classés par pertinence, pas par commission." },
  { q: "Est-ce que Vinsales m'aide pour la création de mon entreprise ?", a: "Nous nous concentrons sur les services post-création : domiciliation, banque pro, comptabilité, assurance. Pour la création en elle-même, nous pouvons vous orienter vers nos partenaires spécialisés." },
  { q: "Puis-je être rappelé à une heure précise ?",                  a: "Oui ! En remplissant le formulaire de rappel, vous pouvez choisir votre créneau horaire préféré. Nos conseillers sont disponibles du lundi au samedi, de 9h à 19h." },
] as const;

export const articles = [
  { id: 1, title: "SARL ou EURL ? Quelle structure juridique choisir en 2026", excerpt: "Comparaison complète des avantages et inconvénients de chaque forme juridique pour votre entreprise.", category: "Création", author: "Clara Moreau", date: "15 avril 2026", readTime: "8 min", views: 2340, image: "https://images.pexels.com/photos/159888/legal-law-attorney-legislation-159888.jpeg?auto=compress&cs=tinysrgb&w=600", featured: true },
  { id: 2, title: "5 erreurs à éviter quand on crée sa première entreprise",   excerpt: "Les pièges les plus courants et comment les contourner pour bien démarrer.",                                  category: "Entrepreneuriat", author: "Thomas Leclerc", date: "12 avril 2026", readTime: "6 min", views: 1850, image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600", featured: true },
  { id: 3, title: "Comparatif des banques pro 2026 : Shine vs Qonto vs Revolut", excerpt: "Analyse détaillée des meilleures banques professionnelles du marché.",                                       category: "Banque pro",     author: "Sophie Bernard", date: "10 avril 2026", readTime: "12 min", views: 3120, image: "https://images.pexels.com/photos/3532557/pexels-photo-3532557.jpeg?auto=compress&cs=tinysrgb&w=600", featured: true },
  { id: 4, title: "Comment gérer sa trésorerie en tant que micro-entrepreneur", excerpt: "Conseils pratiques et outils pour optimiser votre cash-flow.",                                                category: "Finance",         author: "Marc Durand",   date: "8 avril 2026",  readTime: "7 min",  views: 945,  image: "https://images.pexels.com/photos/3694820/pexels-photo-3694820.jpeg?auto=compress&cs=tinysrgb&w=600", featured: false },
  { id: 5, title: "Statut auto-entrepreneur : avantages fiscaux à connaître",   excerpt: "Guide complet des réductions d'impôts et aides disponibles.",                                                  category: "Fiscalité",       author: "Julie Petit",   date: "5 avril 2026",  readTime: "9 min",  views: 1560, image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600", featured: false },
  { id: 6, title: "Assurance pro : ce qu'il faut vraiment couvrir",             excerpt: "Explications sur les types de couverture et les montants recommandés.",                                       category: "Assurance",       author: "Antoine Mercier", date: "2 avril 2026", readTime: "10 min", views: 1230, image: "https://images.pexels.com/photos/3836292/pexels-photo-3836292.jpeg?auto=compress&cs=tinysrgb&w=600", featured: false },
] as const;
