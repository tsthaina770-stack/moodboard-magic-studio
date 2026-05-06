export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          auteur_id: string | null
          categorie_id: string | null
          contenu: string | null
          cover_url: string | null
          created_at: string
          extrait: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          publie_le: string | null
          slug: string
          statut: string
          temps_lecture_min: number | null
          titre: string
          updated_at: string
        }
        Insert: {
          auteur_id?: string | null
          categorie_id?: string | null
          contenu?: string | null
          cover_url?: string | null
          created_at?: string
          extrait?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          publie_le?: string | null
          slug: string
          statut?: string
          temps_lecture_min?: number | null
          titre: string
          updated_at?: string
        }
        Update: {
          auteur_id?: string | null
          categorie_id?: string | null
          contenu?: string | null
          cover_url?: string | null
          created_at?: string
          extrait?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          publie_le?: string | null
          slug?: string
          statut?: string
          temps_lecture_min?: number | null
          titre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories_service"
            referencedColumns: ["id"]
          },
        ]
      }
      categories_service: {
        Row: {
          created_at: string
          description: string | null
          icone: string | null
          id: string
          nom: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icone?: string | null
          id?: string
          nom: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icone?: string | null
          id?: string
          nom?: string
          slug?: string
        }
        Relationships: []
      }
      clics_partenaires: {
        Row: {
          created_at: string
          id: string
          lead_id: string | null
          partenaire_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id?: string | null
          partenaire_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string | null
          partenaire_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clics_partenaires_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clics_partenaires_partenaire_id_fkey"
            columns: ["partenaire_id"]
            isOneToOne: false
            referencedRelation: "partenaires"
            referencedColumns: ["id"]
          },
        ]
      }
      comparateurs: {
        Row: {
          actif: boolean
          categorie_id: string | null
          created_at: string
          id: string
          logique_scoring: Json
          questions: Json
          titre: string
        }
        Insert: {
          actif?: boolean
          categorie_id?: string | null
          created_at?: string
          id?: string
          logique_scoring?: Json
          questions?: Json
          titre: string
        }
        Update: {
          actif?: boolean
          categorie_id?: string | null
          created_at?: string
          id?: string
          logique_scoring?: Json
          questions?: Json
          titre?: string
        }
        Relationships: [
          {
            foreignKeyName: "comparateurs_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories_service"
            referencedColumns: ["id"]
          },
        ]
      }
      guides_pdf: {
        Row: {
          actif: boolean
          created_at: string
          description: string | null
          fichier_url: string | null
          id: string
          nb_telechargements: number
          titre: string
        }
        Insert: {
          actif?: boolean
          created_at?: string
          description?: string | null
          fichier_url?: string | null
          id?: string
          nb_telechargements?: number
          titre: string
        }
        Update: {
          actif?: boolean
          created_at?: string
          description?: string | null
          fichier_url?: string | null
          id?: string
          nb_telechargements?: number
          titre?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          comparateur_id: string | null
          created_at: string
          email: string
          id: string
          partenaire_id: string | null
          prenom: string | null
          source_formulaire: string | null
          statut: string
          sujet: string | null
          telephone: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          comparateur_id?: string | null
          created_at?: string
          email: string
          id?: string
          partenaire_id?: string | null
          prenom?: string | null
          source_formulaire?: string | null
          statut?: string
          sujet?: string | null
          telephone?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          comparateur_id?: string | null
          created_at?: string
          email?: string
          id?: string
          partenaire_id?: string | null
          prenom?: string | null
          source_formulaire?: string | null
          statut?: string
          sujet?: string | null
          telephone?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_comparateur_id_fkey"
            columns: ["comparateur_id"]
            isOneToOne: false
            referencedRelation: "comparateurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_partenaire_id_fkey"
            columns: ["partenaire_id"]
            isOneToOne: false
            referencedRelation: "partenaires"
            referencedColumns: ["id"]
          },
        ]
      }
      partenaires: {
        Row: {
          actif: boolean
          categorie_id: string | null
          commission_taux: number | null
          created_at: string
          description: string | null
          id: string
          lien_affiliation: string | null
          logo_url: string | null
          nom: string
          ordre_affichage: number
          owner_user_id: string | null
          plateforme_affil: string | null
          updated_at: string
        }
        Insert: {
          actif?: boolean
          categorie_id?: string | null
          commission_taux?: number | null
          created_at?: string
          description?: string | null
          id?: string
          lien_affiliation?: string | null
          logo_url?: string | null
          nom: string
          ordre_affichage?: number
          owner_user_id?: string | null
          plateforme_affil?: string | null
          updated_at?: string
        }
        Update: {
          actif?: boolean
          categorie_id?: string | null
          commission_taux?: number | null
          created_at?: string
          description?: string | null
          id?: string
          lien_affiliation?: string | null
          logo_url?: string | null
          nom?: string
          ordre_affichage?: number
          owner_user_id?: string | null
          plateforme_affil?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partenaires_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories_service"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          entreprise: string | null
          id: string
          nom: string | null
          prenom: string | null
          telephone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          entreprise?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          entreprise?: string | null
          id?: string
          nom?: string | null
          prenom?: string | null
          telephone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recommandations: {
        Row: {
          created_at: string
          id: string
          partenaire_id: string | null
          rang: number
          reponse_id: string | null
          score: number
        }
        Insert: {
          created_at?: string
          id?: string
          partenaire_id?: string | null
          rang?: number
          reponse_id?: string | null
          score?: number
        }
        Update: {
          created_at?: string
          id?: string
          partenaire_id?: string | null
          rang?: number
          reponse_id?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "recommandations_partenaire_id_fkey"
            columns: ["partenaire_id"]
            isOneToOne: false
            referencedRelation: "partenaires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommandations_reponse_id_fkey"
            columns: ["reponse_id"]
            isOneToOne: false
            referencedRelation: "reponses_comparateur"
            referencedColumns: ["id"]
          },
        ]
      }
      reponses_comparateur: {
        Row: {
          comparateur_id: string | null
          created_at: string
          id: string
          lead_id: string | null
          reponses: Json
        }
        Insert: {
          comparateur_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          reponses?: Json
        }
        Update: {
          comparateur_id?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          reponses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "reponses_comparateur_comparateur_id_fkey"
            columns: ["comparateur_id"]
            isOneToOne: false
            referencedRelation: "comparateurs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reponses_comparateur_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "partenaire" | "createur" | "visiteur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "partenaire", "createur", "visiteur"],
    },
  },
} as const
