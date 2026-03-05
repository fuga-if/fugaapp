"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (slug: string, options: Record<string, string>) => void;
    };
  }
}

export default function KofiButton(): React.ReactElement | null {
  const loaded = useRef(false);
  const [dismissed, setDismissed] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const style = document.createElement("style");
    style.textContent = `
      .floatingchat-container-wrap,
      .floatingchat-container-wrap-mobi {
        left: 12px !important;
        right: auto !important;
        bottom: 100px !important;
        top: auto !important;
      }
      .floatingchat-container,
      .floatingchat-container-mobi {
        left: 12px !important;
        right: auto !important;
      }
      .floatingchat-donate-button {
        transform: scale(0.5) !important;
        transform-origin: bottom left !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.onload = () => {
      window.kofiWidgetOverlay?.draw("fugaapp", {
        type: "floating-chat",
        "floating-chat.donateButton.text": "支援する",
        "floating-chat.donateButton.background-color": "#00b9fe",
        "floating-chat.donateButton.text-color": "#fff",
      });
      // Shrink the button after widget renders
      setTimeout(() => {
        document.querySelectorAll<HTMLElement>(
          ".floatingchat-container-wrap, .floatingchat-container-wrap-mobi"
        ).forEach((el) => {
          el.style.transform = "scale(0.5)";
          el.style.transformOrigin = "bottom left";
        });
      }, 500);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!styleRef.current) {
      const s = document.createElement("style");
      document.head.appendChild(s);
      styleRef.current = s;
    }
    styleRef.current.textContent = dismissed
      ? `#kofi-widget-overlay-root,
         .floatingchat-container-wrap,
         .floatingchat-container-wrap-mobi,
         .floatingchat-container,
         .floatingchat-container-mobi { display: none !important; }`
      : "";
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <button
      onClick={() => setDismissed(true)}
      aria-label="閉じる"
      style={{
        position: "fixed",
        left: 8,
        bottom: 132,
        zIndex: 10000,
        width: 16,
        height: 16,
        borderRadius: 8,
        border: "none",
        background: "rgba(0,0,0,0.6)",
        color: "#aaa",
        fontSize: 11,
        lineHeight: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ×
    </button>
  );
}
