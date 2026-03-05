"use client";

export default function KofiButton(): React.ReactElement {
  return (
    <a
      href="https://ko-fi.com/W7W71VF1Z0"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#72a4f2",
        color: "#fff",
        fontWeight: 700,
        fontSize: 12,
        padding: "6px 12px",
        borderRadius: 20,
        textDecoration: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <img
        src="https://storage.ko-fi.com/cdn/cup-border.png"
        alt=""
        style={{ height: 16, width: 16 }}
      />
      支援する
    </a>
  );
}
