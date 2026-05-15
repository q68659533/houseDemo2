export function Footer() {
  return (
    <footer className="relative z-10 border-t border-ac-blue/[0.06] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>房产智能门户 &copy; {new Date().getFullYear()}</p>
          <div className="flex items-center gap-4">
            <span>Next.js</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>FastAPI</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>Spring Boot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
