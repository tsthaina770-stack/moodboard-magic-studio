import { useState, type FormEvent } from "react";
import { Check, Phone } from "lucide-react";

const services = ["Domiciliation", "Banque pro", "Comptabilité", "Assurance", "Énergie", "Autre"];
const slots = ["9h-12h", "12h-15h", "15h-19h"];

export function CallbackForm() {
  const [data, setData] = useState({ name: "", phone: "", service: "Domiciliation", time: "9h-12h" });
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl p-8 shadow-lg text-center animate-scale-in" style={{ backgroundColor: "#0B2A4A" }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "rgba(24,194,156,0.2)" }}
        >
          <Check size={32} style={{ color: "#18C29C" }} />
        </div>
        <h3 className="font-display font-bold text-xl text-white mb-3">Demande envoyée !</h3>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
          Un conseiller Vinsales vous contactera dans les prochaines 24h.
        </p>
        <button
          onClick={() => setSent(false)}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.08)",
    border: "1.5px solid rgba(255,255,255,0.15)",
    color: "white",
    fontFamily: "Inter, sans-serif",
  } as const;

  return (
    <form onSubmit={submit} className="rounded-2xl p-8 shadow-lg space-y-5" style={{ backgroundColor: "#0B2A4A" }}>
      <div>
        <p className="font-display font-semibold text-lg text-white mb-1">Demander un rappel gratuit</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Réponse garantie sous 24h</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
            Prénom *
          </label>
          <input
            required
            value={data.name}
            onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
            placeholder="Jean"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2F6BFF] transition-colors"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
            Téléphone *
          </label>
          <input
            required
            type="tel"
            value={data.phone}
            onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
            placeholder="06 12 34 56 78"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#2F6BFF] transition-colors"
            style={inputStyle}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.7)" }}>
          Service souhaité
        </label>
        <select
          value={data.service}
          onChange={(e) => setData((d) => ({ ...d, service: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={inputStyle}
        >
          {services.map((s) => (
            <option key={s} value={s} style={{ backgroundColor: "#0B2A4A" }}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
          Créneau préféré
        </label>
        <div className="grid grid-cols-3 gap-2">
          {slots.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setData((d) => ({ ...d, time: s }))}
              className="py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: data.time === s ? "#2F6BFF" : "rgba(255,255,255,0.08)",
                color: data.time === s ? "white" : "rgba(255,255,255,0.65)",
                border: `1.5px solid ${data.time === s ? "#2F6BFF" : "rgba(255,255,255,0.15)"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
        style={{ backgroundColor: "#2F6BFF", boxShadow: "0 8px 24px rgba(47,107,255,0.4)" }}
      >
        <Phone size={15} />
        Demander mon rappel gratuit
      </button>
      <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
        En soumettant, vous acceptez notre politique de confidentialité.
      </p>
    </form>
  );
}
