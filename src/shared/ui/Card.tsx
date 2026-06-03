import type { ReactNode } from "react";

type CardTone = "default" | "danger" | "success";

type CardProps = {
  children: ReactNode;
  className?: string;
  description: string;
  title: string;
  tone?: CardTone;
};

export function Card({
  children,
  className = "",
  description,
  title,
  tone = "default",
}: CardProps) {
  const toneClass = {
    default: "border-slate-200",
    danger: "border-rose-200",
    success: "border-emerald-200",
  }[tone];

  return (
    <article
      className={`col-span-12 rounded-[28px] border p-5 shadow-[var(--shadow-soft)] transition-colors duration-300 md:col-span-6 xl:col-span-4 ${toneClass} ${className}`}
      style={{
        backgroundColor: "var(--panel-bg)",
      }}
    >
      <header className="mb-4">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-(--text-primary)">{title}</h3>
          <p className="text-sm leading-6 text-(--text-secondary)">{description}</p>
        </div>
      </header>
      <div>{children}</div>
    </article>
  );
}
