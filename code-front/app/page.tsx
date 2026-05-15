import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 text-center animate-fade-in-up">
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
      </section>

      {/* Application Cards */}
      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Estimator Card */}
          <Link href="/estimator" className="group block">
            <div className="relative rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-8 transition-all duration-300 hover:border-ac-blue/40 hover:bg-dk-800/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-ac-blue/5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ac-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ac-blue to-ac-cyan flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3.666V2.5A2.5 2.5 0 006.5 0h0A2.5 2.5 0 004 2.5v14.768a2 2 0 001.508 1.94l4.284 1.07A2 2 0 0011.43 20.6l.568-2.843a2 2 0 011.962-1.607h.08a2 2 0 011.962 1.607l.568 2.843a2 2 0 001.64 1.678l4.284 1.07A2 2 0 0022 17.268V2.5a2.5 2.5 0 00-5 0v8.166M9 11h6M9 15h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-ac-blue transition-colors">房产价值估价器</h3>
                  <p className="text-sm text-slate-500">智能房价预测</p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-cyan shrink-0" />
                  7 项房产特征输入与实时验证
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-cyan shrink-0" />
                  ML 模型驱动的精准价格预测
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-cyan shrink-0" />
                  特征贡献可视化分析
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-cyan shrink-0" />
                  历史记录保存与房产对比
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <TechBadge color="blue">Next.js</TechBadge>
                <TechBadge color="cyan">FastAPI</TechBadge>
                <TechBadge color="green">Scikit-learn</TechBadge>
              </div>
            </div>
          </Link>

          {/* Analysis Card */}
          <Link href="/analysis" className="group block">
            <div className="relative rounded-2xl border border-dk-500/50 bg-dk-800/40 backdrop-blur-sm p-8 transition-all duration-300 hover:border-ac-purple/40 hover:bg-dk-800/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-ac-purple/5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ac-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ac-purple to-ac-rose flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-ac-purple transition-colors">市场分析</h3>
                  <p className="text-sm text-slate-500">数据洞察仪表盘</p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-6 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-purple shrink-0" />
                  动态市场数据生成与统计
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-purple shrink-0" />
                  交互式图表与可视化
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-purple shrink-0" />
                  假设分析与参数影响评估
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ac-purple shrink-0" />
                  CSV / PDF 数据导出
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <TechBadge color="blue">Next.js</TechBadge>
                <TechBadge color="amber">Spring Boot</TechBadge>
                <TechBadge color="rose">Chart.js</TechBadge>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Architecture Diagram */}
      <section className="py-16 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
        <h2 className="text-center text-2xl font-bold text-white mb-10">系统架构</h2>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-dk-500/50 bg-dk-800/30 backdrop-blur-sm p-8 sm:p-10">
            <div className="flex flex-col items-center gap-6">
              {/* Frontend Layer */}
              <div className="w-full">
                <div className="text-center text-xs font-medium text-ac-blue uppercase tracking-wider mb-3">前端层</div>
                <div className="flex justify-center">
                  <ArchNode label="Next.js 15" sub="房产智能门户" icon="next" color="blue" />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-3 text-slate-600">
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-xs">HTTP / JSON</span>
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>

              {/* Backend Layer */}
              <div className="w-full">
                <div className="text-center text-xs font-medium text-ac-cyan uppercase tracking-wider mb-3">后端服务层</div>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <ArchNode label="FastAPI" sub="房产估价 API" icon="python" color="cyan" />
                  <ArchNode label="Spring Boot" sub="市场分析 API" icon="java" color="amber" />
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-3 text-slate-600">
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className="text-xs">REST API</span>
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>

              {/* ML Layer */}
              <div className="w-full">
                <div className="text-center text-xs font-medium text-ac-green uppercase tracking-wider mb-3">模型层</div>
                <div className="flex justify-center">
                  <ArchNode label="ML 模型" sub="回归预测服务" icon="ml" color="green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TechBadge({ color, children }: { color: "blue" | "cyan" | "green" | "amber" | "rose" | "purple"; children: React.ReactNode }) {
  const colorMap: Record<string, string> = {
    blue: "bg-ac-blue/10 text-ac-blue border-ac-blue/20",
    cyan: "bg-ac-cyan/10 text-ac-cyan border-ac-cyan/20",
    green: "bg-ac-green/10 text-ac-green border-ac-green/20",
    amber: "bg-ac-amber/10 text-ac-amber border-ac-amber/20",
    rose: "bg-ac-rose/10 text-ac-rose border-ac-rose/20",
    purple: "bg-ac-purple/10 text-ac-purple border-ac-purple/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${colorMap[color]}`}>
      {children}
    </span>
  );
}

function ArchNode({ label, sub, icon, color }: { label: string; sub: string; icon: string; color: string }) {
  const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    blue: {
      bg: "bg-ac-blue/10",
      border: "border-ac-blue/20",
      text: "text-ac-blue",
      iconBg: "bg-ac-blue/20",
    },
    cyan: {
      bg: "bg-ac-cyan/10",
      border: "border-ac-cyan/20",
      text: "text-ac-cyan",
      iconBg: "bg-ac-cyan/20",
    },
    green: {
      bg: "bg-ac-green/10",
      border: "border-ac-green/20",
      text: "text-ac-green",
      iconBg: "bg-ac-green/20",
    },
    amber: {
      bg: "bg-ac-amber/10",
      border: "border-ac-amber/20",
      text: "text-ac-amber",
      iconBg: "bg-ac-amber/20",
    },
    purple: {
      bg: "bg-ac-purple/10",
      border: "border-ac-purple/20",
      text: "text-ac-purple",
      iconBg: "bg-ac-purple/20",
    },
    rose: {
      bg: "bg-ac-rose/10",
      border: "border-ac-rose/20",
      text: "text-ac-rose",
      iconBg: "bg-ac-rose/20",
    },
  };

  const c = colorMap[color] || colorMap.blue;

  const icons: Record<string, React.ReactNode> = {
    next: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    ),
    python: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    java: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    ml: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border ${c.bg} ${c.border} min-w-[180px] justify-center`}>
      <div className={`w-9 h-9 rounded-lg ${c.iconBg} ${c.text} flex items-center justify-center shrink-0`}>
        {icons[icon] || icons.next}
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
    </div>
  );
}
