// components/layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6 text-center text-xs text-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between">
        <span>
          © {new Date().getFullYear()} BYUND. All rights reserved.
        </span>
        <span className="tracking-[0.35em] text-[10px]">
          B Y U N D
        </span>
      </div>
    </footer>
  );
}
