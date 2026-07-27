import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal, SectionHeading } from './primitives';

const faqs = [
  {
    q: 'How is Kaifa different from a course marketplace?',
    a: 'Marketplaces sell you videos. Kaifa builds an adaptive path: every answer updates a model of what you know, and the next lesson is chosen for you. You finish more, and you retain more.',
  },
  {
    q: 'Do I need to commit to a fixed schedule?',
    a: 'No. Sessions can be as short as ten minutes. If you disappear for two weeks, the engine recalibrates your path instead of penalising you.',
  },
  {
    q: 'Are the certificates recognised?',
    a: 'Certificates are issued only after mastery checkpoints, are independently verifiable via a public link, and include the underlying skill breakdown so employers can see what you actually demonstrated.',
  },
  {
    q: 'Can I learn offline?',
    a: 'Yes. Download any module on mobile or tablet. Progress is stored locally and synced automatically the next time you are online.',
  },
  {
    q: 'Does Kaifa work for institutions and teams?',
    a: 'Institutions get cohort management, mentor dashboards, and exportable analytics on mastery and engagement — with the same learner experience underneath.',
  },
  {
    q: 'Is there a free plan?',
    a: 'You can start free, complete a placement, and work through introductory modules in every category before deciding on a plan.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="relative px-4 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions, answered plainly." />

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-12 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="overflow-hidden rounded-2xl border border-rule/70 bg-surface/70 px-5 backdrop-blur-xl transition-colors duration-300 last:border-b data-[state=open]:border-secondary/25"
              >
                <AccordionTrigger className="py-5 text-left font-display text-[16px] font-semibold tracking-[-0.02em] text-ink hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[14.5px] leading-[1.75] text-ink-muted">
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
