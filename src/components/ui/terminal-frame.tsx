"use client";

interface TerminalFrameProps {
  children: React.ReactNode;
  title?: string;
  variant?: "default" | "success" | "error";
  className?: string;
}

const dotColors = {
  default: { close: "bg-zinc-600", minimize: "bg-zinc-600", maximize: "bg-zinc-600" },
  success: { close: "bg-red-500", minimize: "bg-yellow-500", maximize: "bg-green-500" },
  error: { close: "bg-red-500", minimize: "bg-yellow-500", maximize: "bg-zinc-600" },
};

const variantStyles = {
  default: {
    border: "border-white/[0.06]",
    shadow: "shadow-2xl shadow-black/50",
    titleBar: "bg-white/[0.03] border-b border-white/[0.06]",
    titleColor: "text-text-secondary",
    badge: null,
  },
  success: {
    border: "border-emerald-500/30",
    shadow: "shadow-2xl shadow-emerald-500/10",
    titleBar: "bg-emerald-500/[0.04] border-b border-emerald-500/20",
    titleColor: "text-emerald-400",
    badge: { label: "NEW", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  },
  error: {
    border: "border-red-500/25",
    shadow: "shadow-2xl shadow-red-500/8",
    titleBar: "bg-red-500/[0.03] border-b border-red-500/15",
    titleColor: "text-red-400/80",
    badge: { label: "OLD", color: "bg-red-500/15 text-red-400 border-red-500/30" },
  },
};

export default function TerminalFrame({
  children,
  title = "terminal",
  variant = "success",
  className = "",
}: TerminalFrameProps) {
  const dots = dotColors[variant];
  const styles = variantStyles[variant];

  return (
    <div
      className={`
        rounded-xl overflow-hidden
        bg-[#0a0a0c] border ${styles.border}
        ${styles.shadow}
        transition-shadow duration-500
        ${className}
      `}
    >
      {/* Title bar */}
      <div className={`flex items-center gap-2 px-4 py-3 ${styles.titleBar}`}>
        <div className="flex gap-1.5">
          <div className={`w-3 h-3 rounded-full ${dots.close}`} />
          <div className={`w-3 h-3 rounded-full ${dots.minimize}`} />
          <div className={`w-3 h-3 rounded-full ${dots.maximize}`} />
        </div>
        <span className={`text-xs font-mono ml-2 ${styles.titleColor}`}>
          {title}
        </span>
        {styles.badge && (
          <span className={`ml-auto text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${styles.badge.color}`}>
            {styles.badge.label}
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
