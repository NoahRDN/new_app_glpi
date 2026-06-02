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
      className={`col-span-12 rounded-2xl border bg-white p-5 shadow-sm md:col-span-6 xl:col-span-4 ${toneClass} ${className}`}
    >
      <header className="mb-4">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </header>
      <div>{children}</div>
    </article>
  );
}
