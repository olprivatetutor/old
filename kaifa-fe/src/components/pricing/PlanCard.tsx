import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CtaButton, StaggerItem } from '@/components/landing/primitives';

export interface PlanAltPrice {
  price: string;
  period: string;
  note?: string;
}

export interface PlanSection {
  title: string;
  items: string[];
  tone?: 'positive' | 'muted';
}

export interface Plan {
  name: string;
  badge?: string;
  price: string;
  period?: string;
  priceNote?: string;
  altPrice?: PlanAltPrice;
  desc: string;
  features: string[];
  sections?: PlanSection[];
  cta: { label: string; href: string };
  highlighted?: boolean;
}

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <StaggerItem className="h-full">
      <article
        className={cn(
          'border-rule/70 bg-surface/70 relative flex h-full flex-col rounded-3xl border p-7 backdrop-blur-xl transition-all duration-500 sm:p-8',
          plan.highlighted && 'border-secondary/40 shadow-[0_30px_60px_-35px_rgba(98,79,140,0.45)]',
        )}
      >
        {plan.badge ? (
          <span className="bg-accent text-accent-foreground absolute -top-3.5 left-7 rounded-full px-3.5 py-1 text-[11.5px] font-bold tracking-[0.02em]">
            {plan.badge}
          </span>
        ) : null}

        <h3 className="font-display text-ink text-[20px] font-bold tracking-[-0.02em]">{plan.name}</h3>

        <div className="mt-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-ink text-[32px] font-extrabold tracking-[-0.03em]">
              {plan.price}
            </span>
            {plan.period ? <span className="text-ink-muted text-[14px] font-medium">{plan.period}</span> : null}
          </div>
          {plan.priceNote ? <p className="text-ink-muted mt-1 text-[13.5px]">{plan.priceNote}</p> : null}
          {plan.altPrice ? (
            <div className="border-rule/70 mt-3 border-t pt-3">
              <p className="text-ink-muted text-[12px] font-medium tracking-[0.04em] uppercase">atau</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-ink text-[20px] font-bold tracking-[-0.02em]">
                  {plan.altPrice.price}
                </span>
                <span className="text-ink-muted text-[13px] font-medium">{plan.altPrice.period}</span>
              </div>
              {plan.altPrice.note ? (
                <p className="text-secondary mt-1 text-[12.5px] font-semibold">{plan.altPrice.note}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <p className="text-ink-muted mt-4 text-[14px] leading-[1.7]">{plan.desc}</p>

        <CtaButton
          href={plan.cta.href}
          variant={plan.highlighted ? 'primary' : 'ghost'}
          className="mt-6 w-full"
        >
          {plan.cta.label}
        </CtaButton>

        <div className="border-rule/70 mt-7 border-t pt-6">
          <p className="text-ink text-[12px] font-semibold tracking-[0.1em] uppercase">Yang Anda dapatkan</p>
          <ul className="mt-4 space-y-2.5">
            {plan.features.map((f) => (
              <li key={f} className="text-ink-muted flex items-start gap-2.5 text-[13.5px] leading-[1.6]">
                <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {plan.sections?.map((section) => (
          <div key={section.title} className="border-rule/70 mt-6 border-t pt-6">
            <p className="text-ink text-[12px] font-semibold tracking-[0.1em] uppercase">{section.title}</p>
            <ul className="mt-4 space-y-2.5">
              {section.items.map((item) => (
                <li key={item} className="text-ink-muted flex items-start gap-2.5 text-[13.5px] leading-[1.6]">
                  {section.tone === 'muted' ? (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-[#b45252]" />
                  ) : (
                    <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                  )}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </StaggerItem>
  );
}
