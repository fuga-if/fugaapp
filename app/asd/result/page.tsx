import { Suspense } from "react";
import { AsdResultContent } from "./ResultContent";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-blue-500">読み込み中...</p></div>}>
      <AsdResultContent />
    </Suspense>
  );
}
