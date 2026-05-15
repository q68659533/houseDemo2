export function Background() {
  return (
    <>
      {/* Floating orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full animate-orb-float"
          style={{
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(59,130,246,.18), rgba(59,130,246,0))",
            top: -250,
            left: -150,
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute rounded-full animate-orb-float"
          style={{
            width: 550,
            height: 550,
            background: "radial-gradient(circle, rgba(6,182,212,.15), rgba(6,182,212,0))",
            bottom: -200,
            right: -100,
            filter: "blur(100px)",
            animationDelay: "-10s",
          }}
        />
        <div
          className="absolute rounded-full animate-orb-float"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(139,92,246,.12), rgba(139,92,246,0))",
            top: "35%",
            left: "50%",
            filter: "blur(100px)",
            animationDelay: "-18s",
          }}
        />
        <div
          className="absolute rounded-full animate-orb-float"
          style={{
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(16,185,129,.10), rgba(16,185,129,0))",
            top: "60%",
            left: "10%",
            filter: "blur(100px)",
            animationDelay: "-5s",
          }}
        />
        <div
          className="absolute rounded-full animate-orb-float"
          style={{
            width: 350,
            height: 350,
            background: "radial-gradient(circle, rgba(245,158,11,.08), rgba(245,158,11,0))",
            top: "10%",
            right: "15%",
            filter: "blur(100px)",
            animationDelay: "-13s",
          }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Scanline effect */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59,130,246,.008) 2px, rgba(59,130,246,.008) 4px)",
        }}
      />
    </>
  );
}
