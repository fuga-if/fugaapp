"use client";

import Link from "next/link";

interface Props {
  currentCategory?: "column" | "tech";
}

const tabs = [
  { label: "すべて", value: undefined, href: "/blog" },
  { label: "コラム", value: "column" as const, href: "/blog?category=column" },
  { label: "技術", value: "tech" as const, href: "/blog?category=tech" },
];

export default function BlogTabs({ currentCategory }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="flex gap-2 justify-center">
        {tabs.map((tab) => {
          const isActive = tab.value === currentCategory;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-500 text-white shadow-md"
                  : "bg-white text-gray-500 hover:bg-purple-50 hover:text-purple-500 border border-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
