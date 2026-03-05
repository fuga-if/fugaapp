"use client";

import { useState } from "react";

export default function KofiButton(): React.ReactElement | null {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <button
        onClick={() => setVisible(false)}
        style={{
          alignSelf: "flex-end",
          width: 16,
          height: 16,
          borderRadius: 8,
          border: "none",
          background: "rgba(0,0,0,0.5)",
          color: "#999",
          fontSize: 10,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        ×
      </button>
      <a
        href="https://ko-fi.com/fugaapp"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          writingMode: "vertical-rl",
          background: "#00b9fe",
          color: "#fff",
          fontWeight: 700,
          fontSize: 10,
          padding: "8px 6px",
          borderRadius: 8,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <img
          src="https://storage.ko-fi.com/cdn/cup-border.png"
          alt=""
          style={{ width: 14, height: 14 }}
        />
        支援する
      </a>
    </div>
  );
}
