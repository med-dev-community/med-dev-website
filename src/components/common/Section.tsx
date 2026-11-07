import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  className?: string;
  eyebrow?: string;
  title?: string;
  /**
   * Heading for sections that are deliberately untitled in the design. Without
   * it the page jumps straight from the h1 to the h3s inside the cards, which
   * is a hole for anyone navigating by heading level.
   */
  srTitle?: string;
  intro?: string;
  children: ReactNode;
};

export function Section({
  id,
  className = "",
  eyebrow,
  title,
  srTitle,
  intro,
  children,
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || intro);

  return (
    <section className={`section ${className}`} id={id}>
      <div className="section__inner">
        {srTitle ? <h2 className="sr-only">{srTitle}</h2> : null}
        {hasHeader ? (
          <div className="section__header reveal">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            {title ? <h2>{title}</h2> : null}
            {intro ? <p className="section__intro">{intro}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
