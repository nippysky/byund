"use client";

/**
 * app/template.tsx — BYUND Page Transition Template
 *
 * We use a plain <div> + CSS @keyframes instead of Framer Motion here.
 * Reason: motion.div internally applies will-change: transform and/or
 * transform: translateZ(0) for GPU promotion — even when only animating opacity.
 * That creates a new CSS "containing block", which causes position: fixed
 * elements (Header) inside the template to scroll away instead of staying
 * pinned to the viewport.
 *
 * CSS opacity animation does NOT create a new containing block, so fixed
 * positioning is preserved. The animation class is defined in globals.css.
 */

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
