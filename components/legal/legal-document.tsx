import type { LegalDocument } from "@/lib/legal/content";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{document.title}</h1>
        <p className="text-muted-foreground text-sm">Effective {document.effectiveDate}</p>
        <p className="text-muted-foreground">{document.intro}</p>
      </header>
      {document.sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-3">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={`${section.id}-p-${index}`} className="text-muted-foreground">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="text-muted-foreground list-disc space-y-1 pl-6">
              {section.list.map((item, index) => (
                <li key={`${section.id}-l-${index}`}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
