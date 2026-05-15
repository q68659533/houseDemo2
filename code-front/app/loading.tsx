export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-ac-blue/20 border-t-ac-blue animate-spin" />
        <p className="text-sm text-slate-500">加载中...</p>
      </div>
    </div>
  );
}
