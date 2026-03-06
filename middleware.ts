import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["ja", "en", "zh", "ko"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: Locale = "ja";

function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const langs = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase());

  for (const lang of langs) {
    for (const locale of SUPPORTED_LOCALES) {
      if (lang.startsWith(locale)) return locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Already has locale prefix → pass through
  if (/^\/(en|zh|ko|ja)\//.test(pathname)) {
    return NextResponse.next();
  }

  // `/my-best/seiyuu` without locale → detect and redirect
  if (pathname === "/my-best/seiyuu") {
    const locale = detectLocale(request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/my-best/seiyuu`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-best/seiyuu", "/(en|zh|ko|ja)/my-best/seiyuu"],
};
