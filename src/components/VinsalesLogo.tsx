interface Props {
  size?: number;
  light?: boolean;
}

export function VinsalesLogo({ size = 36, light = false }: Props) {
  const primary = light ? "#ffffff" : "#0B2A4A";
  const accent = light ? "#7EAEFF" : "#2F6BFF";
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Vinsales">
      <path d="M10 15 L32 62 L40 46" stroke={primary} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M40 46 L48 62 L70 15" stroke={accent} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M55 28 L65 8 L75 22" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
