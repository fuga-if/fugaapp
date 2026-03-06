import { type Locale, LOCALES } from "@/lib/i18n/seiyuu";
import SeiyuuClient from "./SeiyuuClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  return <SeiyuuClient locale={locale as Locale} />;
}
