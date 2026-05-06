
-- ===== ROLES =====
CREATE TYPE public.app_role AS ENUM ('admin', 'partenaire', 'createur', 'visiteur');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  prenom TEXT,
  nom TEXT,
  entreprise TEXT,
  telephone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, prenom)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'prenom', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'createur');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- profiles policies
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin all profiles" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- user_roles policies
CREATE POLICY "own roles select" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== CATEGORIES =====
CREATE TABLE public.categories_service (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories_service ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories_service FOR SELECT USING (true);
CREATE POLICY "admin manage categories" ON public.categories_service FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== PARTENAIRES =====
CREATE TABLE public.partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT NOT NULL,
  categorie_id UUID REFERENCES public.categories_service(id) ON DELETE SET NULL,
  description TEXT,
  logo_url TEXT,
  lien_affiliation TEXT,
  plateforme_affil TEXT,
  commission_taux NUMERIC(5,2),
  actif BOOLEAN NOT NULL DEFAULT true,
  ordre_affichage INT NOT NULL DEFAULT 0,
  owner_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.partenaires ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_partenaires_updated BEFORE UPDATE ON public.partenaires
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "public read active partenaires" ON public.partenaires FOR SELECT USING (actif = true OR public.has_role(auth.uid(), 'admin') OR auth.uid() = owner_user_id);
CREATE POLICY "admin manage partenaires" ON public.partenaires FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partenaire updates own" ON public.partenaires FOR UPDATE USING (auth.uid() = owner_user_id AND public.has_role(auth.uid(), 'partenaire'));

-- ===== COMPARATEURS =====
CREATE TABLE public.comparateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  categorie_id UUID REFERENCES public.categories_service(id) ON DELETE SET NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  logique_scoring JSONB NOT NULL DEFAULT '{}'::jsonb,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.comparateurs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active comparateurs" ON public.comparateurs FOR SELECT USING (actif = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage comparateurs" ON public.comparateurs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== LEADS =====
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom TEXT,
  email TEXT NOT NULL,
  telephone TEXT,
  source_formulaire TEXT,
  sujet TEXT,
  utm_source TEXT,
  utm_campaign TEXT,
  utm_medium TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau',
  partenaire_id UUID REFERENCES public.partenaires(id) ON DELETE SET NULL,
  comparateur_id UUID REFERENCES public.comparateurs(id) ON DELETE SET NULL,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read leads" ON public.leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user read own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "partenaire read own leads" ON public.leads FOR SELECT USING (
  partenaire_id IN (SELECT id FROM public.partenaires WHERE owner_user_id = auth.uid())
);
CREATE POLICY "admin manage leads" ON public.leads FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== REPONSES COMPARATEUR =====
CREATE TABLE public.reponses_comparateur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparateur_id UUID REFERENCES public.comparateurs(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  reponses JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reponses_comparateur ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert reponses" ON public.reponses_comparateur FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read reponses" ON public.reponses_comparateur FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ===== RECOMMANDATIONS =====
CREATE TABLE public.recommandations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reponse_id UUID REFERENCES public.reponses_comparateur(id) ON DELETE CASCADE,
  partenaire_id UUID REFERENCES public.partenaires(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  rang INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recommandations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert recos" ON public.recommandations FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read recos" ON public.recommandations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ===== ARTICLES =====
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  extrait TEXT,
  contenu TEXT,
  meta_title TEXT,
  meta_description TEXT,
  cover_url TEXT,
  auteur_id UUID,
  categorie_id UUID REFERENCES public.categories_service(id) ON DELETE SET NULL,
  statut TEXT NOT NULL DEFAULT 'brouillon',
  publie_le TIMESTAMPTZ,
  temps_lecture_min INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "public read published articles" ON public.articles FOR SELECT USING (statut = 'publie' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage articles" ON public.articles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== GUIDES PDF =====
CREATE TABLE public.guides_pdf (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  description TEXT,
  fichier_url TEXT,
  nb_telechargements INT NOT NULL DEFAULT 0,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.guides_pdf ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read guides" ON public.guides_pdf FOR SELECT USING (actif = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage guides" ON public.guides_pdf FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- ===== CLICS PARTENAIRES =====
CREATE TABLE public.clics_partenaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partenaire_id UUID REFERENCES public.partenaires(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  utm_source TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clics_partenaires ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert clics" ON public.clics_partenaires FOR INSERT WITH CHECK (true);
CREATE POLICY "admin read clics" ON public.clics_partenaires FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partenaire read own clics" ON public.clics_partenaires FOR SELECT USING (
  partenaire_id IN (SELECT id FROM public.partenaires WHERE owner_user_id = auth.uid())
);

-- ===== SEED DATA =====
INSERT INTO public.categories_service (nom, slug, description, icone) VALUES
  ('Domiciliation', 'domiciliation', 'Adresse professionnelle pour votre entreprise', 'Building2'),
  ('Banque pro', 'banque-pro', 'Comptes bancaires pour entrepreneurs', 'Landmark'),
  ('Comptabilité', 'comptabilite', 'Logiciels et experts-comptables', 'Calculator'),
  ('Assurance', 'assurance', 'Protection professionnelle', 'Shield'),
  ('Création', 'creation', 'Création et formalités juridiques', 'FileText');

INSERT INTO public.articles (titre, slug, extrait, contenu, statut, publie_le, temps_lecture_min, meta_title, meta_description) VALUES
  ('Comment créer sa SASU en 2026', 'creer-sasu-2026', 'Le guide complet pour créer votre SASU en moins de 24h.', 'Contenu complet à venir...', 'publie', now(), 6, 'Créer sa SASU en 2026 — Vinsales', 'Le guide pratique pour lancer votre SASU rapidement.'),
  ('Choisir sa banque pro', 'choisir-banque-pro', 'Néobanque ou banque traditionnelle ? Notre comparatif.', 'Contenu complet à venir...', 'publie', now(), 5, 'Choisir sa banque pro — Vinsales', 'Comparez les meilleures banques pour entrepreneurs.'),
  ('La domiciliation expliquée', 'domiciliation-expliquee', 'Tout comprendre sur la domiciliation d''entreprise.', 'Contenu complet à venir...', 'publie', now(), 4, 'Domiciliation — Vinsales', 'Comprenez la domiciliation en 5 minutes.');
