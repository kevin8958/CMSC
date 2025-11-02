export default function Forbidden() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">403 — Forbidden</h1>
      <p className="text-gray-500">접근 권한이 없습니다.</p>
    </div>
  );
}
