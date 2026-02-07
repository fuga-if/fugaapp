import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminContent from "./AdminContent";

interface Props {
  searchParams: Promise<{ key?: string }>;
}

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const adminKey = process.env.ADMIN_KEY;

  const paramKey = params.key;
  const cookieKey = cookieStore.get("admin_key")?.value;

  const isAuthed = paramKey === adminKey || cookieKey === adminKey;

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 認証が必要です</h1>
          <p className="text-gray-500">URLパラメータに正しいキーを指定してください</p>
        </div>
      </div>
    );
  }

  // If authenticated via param, set cookie via client component
  const needSetCookie = paramKey === adminKey && cookieKey !== adminKey;

  return <AdminContent needSetCookie={needSetCookie} adminKey={adminKey!} />;
}
