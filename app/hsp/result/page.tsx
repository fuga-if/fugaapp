import { Suspense } from "react";
import { HspResultContent } from "./ResultContent";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-purple-500">読み込み中...</p></div>}>
      <HspResultContent />
    </Suspense>
  );
}
