export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center animate-fade-in-up">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-ac-blue/20 bg-ac-blue/5 text-xs text-ac-blue font-medium">
          机器学习驱动 · 多应用平台
        </div>
        <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          房产智能
          <br />
          <span className="bg-gradient-to-r from-ac-blue via-ac-cyan to-emerald-400 bg-clip-text text-transparent">
            门户平台
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          统一托管两个独立应用，由机器学习回归模型驱动，提供房价预测与市场分析能力。
        </p>
      </div>
    </div>
  );
}
