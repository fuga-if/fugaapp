"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (slug: string, options: Record<string, string>) => void;
    };
  }
}

export default function KofiButton(): React.ReactElement | null {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";
    script.onload = () => {
      window.kofiWidgetOverlay?.draw("fugaapp", {
        type: "floating-chat",
        "floating-chat.donateButton.text": "支援する",
        "floating-chat.donateButton.background-color": "#00b9fe",
        "floating-chat.donateButton.text-color": "#fff",
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
