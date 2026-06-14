interface LogoProps {
  size?: number;
  /** If true, show "GOVERNANCE" sub-label beneath BYUND */
  withProduct?: boolean;
  /** If true, show full wordmark text next to icon */
  showText?: boolean;
}

export default function Logo({ size = 32, withProduct = true, showText = true }: LogoProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="44" fill="url(#byund-logo-grad)" />
        <defs>
          <linearGradient id="byund-logo-grad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b8acfe" />
            <stop offset="1" stopColor="#4f3dd4" />
          </linearGradient>
        </defs>
        <path
          opacity=".93"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M62 52h46c20 0 34 12 34 30 0 10-5 19-13 24 11 5 18 15 18 28 0 20-15 34-37 34H62V52Zm28 50h16c7 0 12-5 12-12s-5-12-12-12H90v24Zm0 46h18c9 0 14-5 14-13s-5-14-14-14H90v27Z"
          fill="#fff"
        />
      </svg>

      {showText && (
        <div>
          <div style={{
            fontSize: size > 28 ? 11 : 10,
            fontWeight: 800,
            letterSpacing: "0.14em",
            color: "var(--brand)",
            lineHeight: 1,
          }}>
            BYUND
          </div>
          {withProduct && (
            <div style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "var(--text-muted)",
              marginTop: 2,
              lineHeight: 1,
            }}>
              GOVERNANCE
            </div>
          )}
        </div>
      )}
    </div>
  );
}
