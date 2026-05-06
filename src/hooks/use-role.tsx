import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type AppRole = "admin" | "partenaire" | "createur" | "visiteur";

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }
    let cancel = false;
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (cancel) return;
      setRoles((data?.map((r) => r.role as AppRole)) ?? []);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [user, authLoading]);

  const primary: AppRole = roles.includes("admin")
    ? "admin"
    : roles.includes("partenaire")
    ? "partenaire"
    : roles.includes("createur")
    ? "createur"
    : "visiteur";

  return { roles, primary, loading: authLoading || loading, has: (r: AppRole) => roles.includes(r) };
}
