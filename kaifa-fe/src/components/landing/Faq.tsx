import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal, SectionHeading } from './primitives';
import { faqs } from './faq-data';

export function Faq() {
  return (
    <section id="faq" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Pertanyaan, dijawab dengan lugas." />

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-rule/70 bg-surface/70 data-[state=open]:border-secondary/25 overflow-hidden rounded-2xl border px-5 backdrop-blur-xl transition-colors duration-300 last:border-b"
              >
                <AccordionTrigger className="font-display text-ink py-5 text-left text-[16px] font-semibold tracking-[-0.02em] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-ink-muted pb-5 text-[14.5px] leading-[1.75]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
